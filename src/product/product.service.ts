import { Injectable } from '@nestjs/common';
import { Arango } from '../arango/Arango';
import { ProductDto } from './product.dto';
import { CompanyService } from '../company/company.service';

@Injectable()
export class ProductService {
  col;
  userCol;

  constructor(private arango: Arango, private companyService: CompanyService) {
    this.col = arango.getCol('products');
    this.userCol = arango.getCol('users');
  }

  getProduct(q) {

    let query='for i in products '
    if (q.sort!==undefined){
      query+=`\nsort i.${q.sort} DESC`
    }
    if (q.limit==true){
      query+=`\nlimit 15
`
    }
    query+='\nreturn i'
    console.log(query);

    return this.arango.executeGetQuery(query)
  }

  async getFilteredProduct(data) {
    let filterArr = [];
    for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
      let isOnFilterArr = false;
      for (
        let filterArrIndex = 0;
        filterArrIndex < filterArr.length;
        filterArrIndex++
      ) {
        if (data[dataIndex].name === filterArr[filterArrIndex].menuName) {
          filterArr[filterArrIndex].menuValue.push(data[dataIndex].item);
          isOnFilterArr = true;
        }
      }
      if (!isOnFilterArr) {
        filterArr.push({
          menuName: data[dataIndex].name,
          menuValue: [data[dataIndex].item],
        });
      }
    }
    console.log(filterArr);

    let finalStr = '';
    let preQuery=`for u in products\n`
    for (let i = 0; i < filterArr.length; i++) {
      let str = '(';
      for (let j = 0; j < filterArr[i]['menuValue'].length; j++) {
        // console.log(2, filterArr[i]['menuValue']);
        if (j !== 0) {
          str += ' || ';
        }
        if (filterArr[i]['menuName']!=='coverSelect' && filterArr[i]['menuName']!=='dimensionsSelect'&&filterArr[i]['menuName']!=='sideSheetType'){
          str += `u.${filterArr[i]['menuName']} == "${filterArr[i]['menuValue'][j]}"`;
        }else {
          if (filterArr[i]['menuName']==='coverSelect'){
            if (j==0){
              preQuery+=`for j in u.coverSelect\n`
            }
            str += `j == "${filterArr[i]['menuValue'][j]}"`;

          }
          else if(filterArr[i]['menuName']==='dimensionsSelect'){
            if (j==0){
              preQuery+=`for m in u.dimensionsSelect\n`
            }
            str += `m == "${filterArr[i]['menuValue'][j]}"`;

          }
          else {
            if (j==0){
              preQuery+=`for s in u.sideSheetType\n`
            }
            str += `s == "${filterArr[i]['menuValue'][j]}"`;
          }
        }
      }
      str += ')';
      if (i < filterArr.length - 1) {
        str += '&&';
      }
      finalStr += str;
      console.log(finalStr);
    }
    console.log(333,preQuery);
    const query = preQuery+`filter ${finalStr}
return u`;
    console.log(query);
    try {
      return await this.arango.executeGetQuery(query);
    } catch (err) {
      if (err.message === 'endpoint is valid but graph is empty') {
        return [];
      } else {
        return err;
      }
    }
  }

  getProductByKey(key) {
    // return this.arango.getByKey(this.col, key);
    const query = `for i in products
filter i._key=="${key}"
update i with {seen:i.seen +1} in products
return NEW`;
    return this.arango.executeGetQuery(query);
  }

  async getProductByKeyArray(userKey) {
    const user = await this.arango.getByKey(this.userCol, userKey);
    console.log(1, user);
    const keys = user[0].fav;
    console.log(keys);

    //   const query=`FOR key IN ${keys}
    // LET doc = DOCUMENT(products, key)
    // RETURN doc`
    //
    //   return await  this.arango.executeGetQuery(query)
    return await this.arango.getByKeyArray(this.col, keys);
  }

  async createProduct(data: ProductDto) {
    const { status, company, sheetSelect } = data;
    let normalStatus;
    if (status == 'موجود') {
      normalStatus = true;
    } else {
      normalStatus = false;
    }
    data['status'] = normalStatus;

    let c = await this.companyService.getCompanyByName(company);
    c = c[0];
    // console.log(c);
    if (sheetSelect in c['sheets']) {
      console.log(c['sheets']);
    } else {
      c['sheets'].push(sheetSelect);
    }
    // console.log(1,c);

    this.companyService.updateCompany(c, c._key);

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
