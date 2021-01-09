import { Injectable } from '@nestjs/common';
import { Arango } from '../arango/Arango';

@Injectable()
export class ContactService {
  contactCol;
  constructor(
    private arango:Arango
  ) {
    this.contactCol=arango.getCol('contact')
  }


  async createContact(data){
    return  await  this.arango.create(this.contactCol,data)
  }
}
