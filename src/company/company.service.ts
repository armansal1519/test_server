import { Injectable } from '@nestjs/common';
import { Arango } from '../arango/Arango';
import { aql } from 'arangojs';

@Injectable()
export class CompanyService {
  col;

  constructor(private arango: Arango) {
    this.col = arango.getCol('company');
  }

  getCompany() {
    return this.arango.getAll(this.col);
  }

  getCompanyByKey(key) {
    return this.arango.getByKey(this.col, key);
  }

  getCompanyByName(name) {
    const query = `for c in company
filter c.name=="${name}"
return c`;
    return this.arango.executeGetQuery(query);
  }

  getSheetFromOneCompany(companyKey) {
    const query = `for i in products
let c= DOCUMENT("company","${companyKey}")
filter i.company==c.name
return i`;
    return this.arango.executeGetQuery(query);
  }

  createCompany(data) {
    data['sheets'] = [];
    return this.arango.create(this.col, data);
  }

  updateCompany(data, key: string) {
    return this.arango.update(this.col, data, key);
  }

  deleteCompany(key) {
    return this.arango.delete(this.col, key);
  }
}
