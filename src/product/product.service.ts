import { Injectable } from '@nestjs/common';
import { Arango } from '../arango/Arango';
import { ProductDto } from './product.dto';

@Injectable()
export class ProductService {
  col;

  constructor(private arango: Arango) {
    this.col = arango.getCol('products');
  }

  getProduct() {
    return this.arango.getAll(this.col);
  }

  getProductByKey(key) {
    return this.arango.getByKey(this.col, key);
  }

  createProduct(data: ProductDto) {
    return this.arango.create(this.col, data);
  }

  updateProduct(data: ProductDto, key: string) {
    return this.arango.update(this.col, data, key);
  }

  deleteProduct(key) {
    return this.arango.delete(this.col, key);
  }
}
