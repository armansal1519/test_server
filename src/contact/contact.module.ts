import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { Arango } from '../arango/Arango';

@Module({
  controllers: [ContactController],
  providers: [ContactService, Arango],
})
export class ContactModule {}
