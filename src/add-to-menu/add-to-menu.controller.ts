import { Body, Controller, Post } from '@nestjs/common';
import { AddToMenuService } from './add-to-menu.service';

@Controller('add-to-menu')
export class AddToMenuController {
  constructor(private addToMenuService: AddToMenuService) {}

  @Post()
  addNewToMenu(@Body() data) {
    this.addToMenuService.addCompanyNameToMenuList(data);
  }
}
