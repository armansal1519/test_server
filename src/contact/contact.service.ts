import { Injectable } from '@nestjs/common';
import { Arango } from '../arango/Arango';

@Injectable()
export class ContactService {
  contactCol;
  constructor(private arango: Arango) {
    this.contactCol = arango.getCol('contact');
  }

  async getContact() {
    const q=`for i in contact
                sort i.createdAt desc
                return i`
    return await this.arango.executeGetQuery(q);
  }

  async getContactByKey(key) {
    return await this.arango.getByKey(this.contactCol, key);
  }

  async createContact(data) {
    data['createdAt'] = new Date();
    data['isAnswered']=false
    return await this.arango.create(this.contactCol, data);
  }

  async updateContact(key,data){
    data['updateAt']=new Date()
   return await this.arango.update(this.contactCol,data,key)
  }
}
