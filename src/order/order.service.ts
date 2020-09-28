import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Arango } from '../arango/Arango';
import { aql } from 'arangojs';
import { ProductService } from '../product/product.service';
import { Zarinpal } from './zarinpal';

@Injectable()
export class OrderService {
  orderCol;
  _db;
  userCol;
  productCol;

  constructor(
    private arango: Arango,
    private productService: ProductService,
    private zarinpal: Zarinpal,
  ) {
    this.userCol = this.arango.getCol('users');
    this.orderCol = this.arango.getEdgeCol('orders');
    this.productCol = this.arango.getEdgeCol('products');
    this._db = this.arango.getDB();
  }

  async getAllOrder() {
    const query = aql`for i in users
      FOR v, e, p IN 1..1 any i GRAPH "user_order_product"
      return {"order":e,"user":i,"product":v}
       `;
    return this.arango.executeGetQuery(query);
  }

  async getAllOrderOfOneUser(key) {
    const query = aql`
      for i in users
      filter i._key==${key}
      FOR v, e, p IN 1..1 any i GRAPH "user_order_product"
      return {"order":e,"user":i,"product":v}
       `;
    return this.arango.executeGetQuery(query);
  }

  getOrderByKey(key) {
    return this.arango.getByKey(this.orderCol, key);
  }

  async createOrder(data, userId, productId) {
    const temp = productId.split('/');
    const productKey = temp[1];
    // console.log(data ,productKey); ok
    data['status']='notValid'
    const orderedProduct = await this.productService.getProductByKey(
      productKey,
    );
    // console.log(orderedProduct[0].doExist) ok;
    if (
      orderedProduct[0].doExist[data.index].numberInStock === 0 ||
      orderedProduct[0].doExist[data.index].numberInStock == null ||
      orderedProduct[0].doExist[data.index].numberInStock < data.number
    ) {
      throw new ConflictException(
        'product number in stock is lower than request',
      );
    }
    if (!orderedProduct[0].doExist[data.index].price) {
      throw new ConflictException('product price have problem');
    }
    const amount = orderedProduct[0].doExist[data.index].price * data.number;
    data['amount']=amount

    const meta = await this.arango.addEdge(
      this.orderCol,
      userId,
      productId,
      data,
    );
    const callBackUrl = `https://bamachoob.com/order/v/${meta._key}`;
    const desc = `خرید از باماچوب`;

    const zarinpalData = {
      Amount: amount, // In Tomans
      CallbackURL: callBackUrl,
      Description: desc,
    };
    const zarinpalResp = await this.zarinpal.createPaymentLink(zarinpalData);
    // console.log(meta, zarinpalResp); ok
    this.arango.update(
      this.orderCol,
      { zarinpalAuthority: zarinpalResp.authority },
      meta._key,
    );
    return zarinpalResp.url;
  }

  async validateOrder(orderKey){
    const order=await this.arango.getByKey(this.orderCol,orderKey)
    console.log(order);
    const data={
      Amount: order[0].amount, // In Tomans
      Authority: order[0].zarinpalAuthority,
    }
    const resp= await this.zarinpal.paymentVerification(data)
     this.arango.update(this.orderCol,{redId:resp.RefID,status:'valid'},orderKey)
    delete order[0].zarinpalAuthority

    delete order[0].index


    return order[0]

  }






  updateOrder(key, data) {
    return this.arango.updateEdge(this.orderCol, data, key);
  }

  deleteOrder(key) {
    return this.arango.deleteEdge(this.orderCol, key);
  }
}
