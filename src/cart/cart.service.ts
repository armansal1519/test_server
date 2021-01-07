import { ConflictException, Injectable } from '@nestjs/common';
import { Arango } from '../arango/Arango';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';
import { AddCartDto, RemoveCartDto } from './cart.dto';

@Injectable()
export class CartService {
  constructor(
    private arango: Arango,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  async addToCart(data: AddCartDto) {
    const { productKey, userKey,index } = data;
    let product = await this.productService.getProductByKey(productKey);

    data['product'] = product[0];
    // console.log(data);
    let user = await this.userService.getUserByKey(userKey);
    user = user[0];
    // console.log(111,product[0]['doExist'][index]['price']);
    if ( product[0]['doExist'][index]['price']==null){
      throw new ConflictException('price must not be null')
    }
    if (user['cart'] === undefined) {
      user['cart'] = [];
      user['cart'].push(data);
      // console.log(1);
    } else {
      const flag = user['cart'].filter(item => {
        return (item.product._key == productKey && item.index===index) ;
      });

      if (flag.length < 1) {
        user['cart'].push(data);
      } else {
        throw new ConflictException('product is in the cart');
      }
    }
    return this.userService.updateUser(user, userKey);
  }

  async removeFromCart(data: RemoveCartDto) {
    const { userKey, productKey,index } = data;
    console.log(1, userKey, productKey,index);

    let user = await this.userService.getUserByKey(userKey);
    user = user[0];
    // console.log(222,user.cart);
    // console.log(555,productKey,index);

    // const newCart = user.cart.filter(item => {
    //   console.log(item.product._key,item.index,item.product._key !== productKey || item.index!==index);
    //   return (item.product._key !== productKey && item.index!==index);
    // });

    let newCart=[]
    console.log(user.cart);
    for (let i = 0; i < user.cart.length; i++) {
      console.log(123,user.cart[i].product._key !== productKey && user.cart[i].index!==index);
      console.log(1234,user.cart[i].product._key , productKey ,user.cart[i].index,index);
      if (user.cart[i].product._key != productKey || user.cart[i].index!=index){
        console.log(user.cart[i]);
        newCart.push(user.cart[i])
      }
    }

    console.log(333,newCart);
    user['cart'] = newCart;
    return this.userService.updateUser(user, userKey);
  }
}
