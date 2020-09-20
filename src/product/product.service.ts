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
    const { status } = data;
    let normalStatus;
    if (status == 'موجود') {
      normalStatus = true;
    } else {
      normalStatus = false;
    }
    data['status']=normalStatus
    // data['numberInStock']=0
    // data['price']=null



    // for (let i = 0; i < data.coverSelect.length; i++) {
    //   for (let j = 0; j < data.sheetSelect.length; j++) {
    //     for (let k = 0; k < data.dimensionsSelect.length; k++) {
    //       for (let l = 0; l < data.thicknessSelect.length; l++) {
    //         const expandData = {
    //           company: data.company,
    //           coverType: data.coverSelect[i],
    //           sheetType: data.sheetSelect[j],
    //           dimension: data.dimensionsSelect[k],
    //           thickness: data.thicknessSelect[l],
    //           sheetCountry: data.sheetCountry,
    //           coverCountry: data.coverCountry,
    //           code: data.code,
    //           name: data.name,
    //           numberInPalet: data.numberInPalet,
    //           quality: data.quality,
    //           status: normalStatus,
    //           imageUrl: data.imageUrl,
    //         };
    //         this.arango.create(this.col, expandData);
    //       }
    //     }
    //   }
    // }
    this.arango.create(this.col, data);

  }

  updateProduct(data: ProductDto, key: string) {
    return this.arango.update(this.col, data, key);
  }

  deleteProduct(key) {
    return this.arango.delete(this.col, key);
  }
}
