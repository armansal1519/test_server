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
  order_product_edge;
  order_user_edge;

  _db;
  userCol;
  productCol;
  productHistoryCol;

  constructor(
    private arango: Arango,
    private productService: ProductService,
    private zarinpal: Zarinpal,
  ) {
    this.userCol = this.arango.getCol('users');
    this.orderCol = this.arango.getCol('orders');
    this.order_user_edge = this.arango.getEdgeCol('order-user');
    this.order_product_edge = this.arango.getEdgeCol('order-products');
    this.productCol = this.arango.getCol('products');
    this.productHistoryCol = this.arango.getCol('productHistory');
    this._db = this.arango.getDB();
  }

  async getAllOrder() {
    const query = aql`for i in orders
sort i.dateOfOrder desc
return i
       `;
    return this.arango.executeGetQuery(query);

    // return this.arango.getAll(this.orderCol);
  }

  async getAllOrderOfOneUser(key) {
    const query = aql`
    for i in users
    filter i._key==${key}
    let orderArr=(FOR v IN 1..1 outBOUND i GRAPH "user-order-product"
    
    return v)
    
    for j in orderArr
    let product=(FOR v IN 1..1 outBOUND j GRAPH "user-order-product"
    
    return v)
    
    return{"order":j,"product":product}
       `;
    return this.arango.executeGetQuery(query);
  }

  getOrderByKey(key) {
    const query = aql`
    for i in orders
      filter i._key==${key}
      let product=(FOR v,e IN 1..1 outBOUND i GRAPH "user-order-product"
      
      return {"product":v,"orderEdge":e})
      
      let user=(FOR v IN 1..1 inBOUND i GRAPH "user-order-product"
      
      return v)
      
      return{"order":i,"product":product,"user":user[0]}
       `;
    return this.arango.executeGetQuery(query);
    // return this.arango.getByKey(this.orderCol, key);
  }

  async createOrder(data) {
    console.log(data);
    let totalCost = 0;
    // const metaArr = [];
    const {
      userId,
      paymentMethod,
      sendMethod,
      addressIndex,
      dateOfOrder,
      addInfo,
    } = data[0];
    const order = await this.orderCol.save(
      { paymentMethod, sendMethod, addressIndex, dateOfOrder, addInfo },
      { returnNew: true },
    );

    for (let i = 0; i < data.length; i++) {
      const { productId } = data[i];
      const temp = productId.split('/');
      const productKey = temp[1];
      // console.log(data ,productKey); ok
      data['status'] = 'notValid';
      const orderedProduct = await this.productService.getProductByKey(
        productKey,
      );
      if (
        orderedProduct[0].doExist[data[i].index].numberInStock === 0 ||
        orderedProduct[0].doExist[data[i].index].numberInStock == null ||
        orderedProduct[0].doExist[data[i].index].numberInStock < data.number
      ) {
        throw new ConflictException(
          'product number in stock is lower than request',
        );
      }

      const query = `for i in products
filter i._key=="${productKey}"
update i with {ordered:i.ordered +1} in products
`;
      await this.arango.executeEmptyQuery(query);

      if (!orderedProduct[0].doExist[data[i].index].price) {
        throw new ConflictException('product price have problem');
      }
      const amount =
        orderedProduct[0].doExist[data[i].index].price * data[i].number;
      totalCost += amount;
      data['amount'] = amount;

      const productHistoryId = await this.createHistoryProduct(
        productKey,
        data[i].index,
        data[i].number,
      );
      delete data[i]['userId'];
      delete data[i]['productId'];

      const meta = await this.arango.addEdge(
        this.order_product_edge,
        order._id,
        productHistoryId,
        data[i],
      );

      // metaArr.push(meta._key);
    }
    // const temp = productId.split('/');
    // const productKey = temp[1];
    // // console.log(data ,productKey); ok
    // data['status'] = 'notValid';
    // const orderedProduct = await this.productService.getProductByKey(
    //   productKey,
    // );
    // // console.log(orderedProduct[0].doExist) ok;
    // if (
    //   orderedProduct[0].doExist[data.index].numberInStock === 0 ||
    //   orderedProduct[0].doExist[data.index].numberInStock == null ||
    //   orderedProduct[0].doExist[data.index].numberInStock < data.number
    // ) {
    //   throw new ConflictException(
    //     'product number in stock is lower than request',
    //   );
    // }
    // if (!orderedProduct[0].doExist[data.index].price) {
    //   throw new ConflictException('product price have problem');
    // }
    // const amount = orderedProduct[0].doExist[data.index].price * data.number;
    // data['amount'] = amount;
    //
    // const productHistoryId=await this.createHistoryProduct(productKey,data.index,data.number)
    // delete data['userId']
    // delete data['productId']
    //
    //
    // const meta = await this.arango.addEdge(
    //   this.orderCol,
    //   userId,
    //   productHistoryId,
    //   data,
    // );
    // console.log(3,meta);
    // const temp = userId.split('/');
    // const userKey = temp[1];
    // let user = await this.arango.getByKey(this.userCol, userKey);
    // user = user[0];

    // if (user.orderHistory === undefined) {
    //   user['orderHistory'] = [];
    // }
    // const callBackUrl = `https://bamachoob.com/order/v/${user.orderHistory.length}/${userKey}`;
    const callBackUrl = `http://localhost:8080/order/v/${order._key}`;
    const desc = `خرید از باماچوب`;

    const zarinpalData = {
      Amount: totalCost, // In Tomans
      CallbackURL: callBackUrl,
      Description: desc,
    };
    const zarinpalResp = await this.zarinpal.createPaymentLink(zarinpalData);
    console.log('zarin', zarinpalResp);
    const temp = userId.split('/');
    const userKey = temp[1];
    let user = await this.arango.getByKey(this.userCol, userKey);
    user = user[0];

    const orderData = {
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      totalCost: totalCost,
      zarinpalAuthority: zarinpalResp.authority,
      status: 'not',
    };

    await this.arango.update(this.orderCol, orderData, order._key);

    // console.log(meta, zarinpalResp); ok
    // this.arango.update(
    //   this.orderCol,
    //   { zarinpalAuthority: zarinpalResp.authority },
    //   meta._key,
    // );
    await this.arango.addEdge(
      this.order_user_edge,
      userId,
      order._id,

      { date: Date.now() },
    );
    return zarinpalResp.url;
  }

  async createHeadLessOrder(data) {
    return;
  }

  async validateOrder(orderKey) {
    let order = await this.arango.getByKey(this.orderCol, orderKey);
    order = order[0];
    const data = {
      Amount: order.totalCost, // In Tomans
      Authority: order.zarinpalAuthority,
    };
    const resp = await this.zarinpal.paymentVerification(data);
    order['refId'] = resp.RefID;
    order['status'] = 'waiting';
    // console.log(3333,user.orderHistory);
    this.arango.update(this.orderCol, order, order._key);

    return order;
  }

  updateOrder(key, data) {
    return this.arango.updateEdge(this.orderCol, data, key);
  }

  deleteOrder(key) {
    return this.arango.deleteEdge(this.orderCol, key);
  }

  async createHistoryProduct(productKey, index, number) {
    let product = await this.productService.getProductByKey(productKey);
    product = product[0];
    const info = product.doExist[index];
    delete product['doExist'];
    product['cover'] = info.sheetInfo[0];
    product['dimension'] = info.sheetInfo[1];
    product['price'] = info.price * number;
    product['number'] = number;
    product['originalKey'] = product['_key'];
    delete product['_id'];
    delete product['_rev'];
    delete product['_key'];

    const meta = await this.arango.create(this.productHistoryCol, product);

    return meta[0]._id;
  }
}
