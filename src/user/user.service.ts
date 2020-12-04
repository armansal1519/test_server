import { Injectable } from '@nestjs/common';
import { Arango } from '../arango/Arango';
import { ProductDto } from '../product/product.dto';
import * as argon2 from 'argon2';
import { ProductService } from '../product/product.service';

@Injectable()
export class UserService {
  userCol;
  constructor(private arango: Arango, private productService: ProductService) {
    this.userCol = arango.getCol('users');
  }

  async getUser() {
    const internalUser = await this.arango.getAll(this.userCol);

    const users = internalUser.map(item => {
      // console.log(item);
      delete item.hashPass;
      return item;
    });
    return users;
  }
  async getUserByPhoneNumber(phoneNumber) {
    return await this.arango.getByPhoneNumber(this.userCol, phoneNumber);
  }

  async getUserByKey(key) {
    console.log(key);
    const internalUser = await this.arango.getByKey(this.userCol, key);
    // console.log(internalUser);
    const users = internalUser.map(item => {
      // console.log(item);
      delete item.hashPass;
      return item;
    });
    return users;
  }
  async createUser(data) {
    await this.arango.create(this.userCol, data);
  }

  async updateUser(data, key: string) {
    if (data['password'] !== undefined) {
      const { password } = data;
      const hashPass = await argon2.hash(password);
      data['hashPass'] = hashPass;
      delete data['password'];
    }
    return this.arango.update(this.userCol, data, key);
  }

  async addFavorite(userKey, productKey) {
    const product = await this.productService.getProductByKey(productKey);

    const query = `for u in users
filter u._key=="${userKey}"
update u with {fav:push(u.fav,"${productKey}",true)} in users
`;
    return await this.arango.executeEmptyQuery(query);
  }

  async removeFav(userKey, productKey) {
    console.log(1, productKey);
    const query = `for u in users
         filter u._key=="${userKey}"
          update u with {fav:REMOVE_VALUE(u.fav,"${productKey}")} in users`;

    await this.arango.executeEmptyQuery(query);
  }

  deleteUser(key) {
    return this.arango.delete(this.userCol, key);
  }
}
