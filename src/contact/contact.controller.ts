import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactDto } from './contact.dto';

@Controller('contact')
export class ContactController {
  constructor(
    private contactService:ContactService
  ) {}

  @Post()
  createContact(@Body() data:ContactDto){
    return this.contactService.createContact(data)
  }


}
