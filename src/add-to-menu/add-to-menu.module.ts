import { Module } from '@nestjs/common';
import { AddToMenuController } from './add-to-menu.controller';
import { AddToMenuService } from './add-to-menu.service';
import { Arango } from '../arango/Arango';

@Module({
  controllers: [AddToMenuController],
  providers: [AddToMenuService, Arango],
})
export class AddToMenuModule {}
