import { Injectable } from '@nestjs/common';
import { Arango } from '../arango/Arango';
import { ProductDto } from './product.dto';
import { CompanyService } from '../company/company.service';

@Injectable()
export class ProductService {
  col;
  userCol;

  constructor(private arango: Arango, private companyService: CompanyService,) {
    this.col = arango.getCol('products');
    this.userCol = arango.getCol('users');
  }

  getProduct() {
    return this.arango.getAll(this.col);
  }

  getProductByKey(key) {
    // return this.arango.getByKey(this.col, key);
    const query=`for i in products
filter i._key=="${key}"
update i with {seen:i.seen +1} in products
return NEW`
    return this.arango.executeGetQuery(query)
  }

  async getProductByKeyArray(userKey){
    const user=await this.arango.getByKey(this.userCol,userKey)
    console.log(1,user);
    const keys=user[0].fav
    console.log(keys);

  //   const query=`FOR key IN ${keys}
  // LET doc = DOCUMENT(products, key)
  // RETURN doc`
  //
  //   return await  this.arango.executeGetQuery(query)
    return await this.arango.getByKeyArray(this.col,keys)
  }

  createProduct(data: ProductDto) {
    const { status, company, sheetSelect } = data;
    let normalStatus;
    if (status == 'موجود') {
      normalStatus = true;
    } else {
      normalStatus = false;
    }
    data['status'] = normalStatus;

    let c = this.companyService.getCompanyByName(company);
    console.log(c);
    if (sheetSelect in c['sheets']) {
      console.log(c['sheets']);
    } else {
      c['sheets'].push(sheetSelect);
    }

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
