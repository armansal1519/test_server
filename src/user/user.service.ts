import { Injectable } from '@nestjs/common';
import { Arango } from '../arango/Arango';
import { ProductDto } from '../product/product.dto';

@Injectable()
export class UserService {
  userCol;
  constructor(private arango: Arango) {
    this.userCol = arango.getCol('users');
  }

  async getUser() {
    const internalUser = await this.arango.getAll(this.userCol);

    const users = internalUser.map(item => {
      console.log(item);
      delete item.hashPass;
      return item;
    });
    return users;
  }

  async getUserByKey(key) {
    console.log(key);
    const internalUser = await this.arango.getByKey(this.userCol, key);
    // console.log(internalUser);
    const users = internalUser.map(item => {
      console.log(item);
      delete item.hashPass;
      return item;
    });
    return users;
  }

  updateUser(data, key: string) {
    return this.arango.update(this.userCol, data, key);
  }

  deleteUser(key) {
    return this.arango.delete(this.userCol, key);
  }
}
