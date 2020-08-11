import { Injectable } from '@nestjs/common';
import { Arango } from '../arango/Arango';
import { ProductDto } from '../product/product.dto';

@Injectable()
export class UserService {

  userCol;
  constructor(
    private arango:Arango
  ) {
    this.userCol= arango.getCol('users')
  }

  getUser() {
    return this.arango.getAll(this.userCol);
  }

  getUserByKey(key) {
    return this.arango.getByKey(this.userCol, key);
  }



  updateUser(data: ProductDto, key: string) {
    return this.arango.update(this.userCol, data, key);
  }

  deleteUser(key) {
    return this.arango.delete(this.userCol, key);
  }
}
