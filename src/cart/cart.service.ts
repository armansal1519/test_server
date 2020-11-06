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
    const { productKey, userKey } = data;
    const product = await this.productService.getProductByKey(productKey);
    // console.log(product);
    data['product'] = product[0];
    console.log(data);
    let user = await this.userService.getUserByKey(userKey);
    user = user[0];
    if (user['cart'] === undefined) {
      user['cart'] = [];
      user['cart'].push(data);
      console.log(1);
    } else {
      const flag = user['cart'].filter(item => {
        return item.product._key == productKey;
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
    const { userKey, productKey } = data;
    console.log(1,userKey,productKey);

    let user = await this.userService.getUserByKey(userKey);
    user = user[0];
    const newCart = user.cart.filter(item => {
      return item.product._key !== productKey;
    });
    console.log(newCart);
    user['cart'] = newCart;
    return this.userService.updateUser(user, userKey);
  }
}
