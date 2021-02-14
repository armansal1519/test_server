import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactDto, UpdateContactDto } from './contact.dto';
import { updateFileWithText } from 'ts-loader/dist/servicesHost';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Get()
  getAllContact() {
    return this.contactService.getContact();
  }

  @Get('/:key')
  getContactByKey(@Param('key') key) {
    return this.contactService.getContactByKey(key);
  }

  @Post()
  createContact(@Body() data: ContactDto) {
    return this.contactService.createContact(data);
  }

  @Patch('/:key')
  update(@Body() data:UpdateContactDto,@Param('key')key){
    console.log(key,data);
    return this.contactService.updateContact(key,data)
  }
}
