import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AddToMenuService } from './add-to-menu.service';
import { AccessGuard } from '../user-auth/access.guard';
import { Access } from '../utils/auth/access.decorator';

@UseGuards(AccessGuard)
@Controller('menu')
export class AddToMenuController {
  constructor(private addToMenuService: AddToMenuService) {}

  @Access('handler', 'user')
  @Get()
  getAllMenu() {
    return this.addToMenuService.getMenu();
  }
  @Access('handler')
  @Post('/add')
  addNewToMenu(@Body() data) {
    return this.addToMenuService.addValueToMenuList(data);
  }
  @Access('handler')
  @Post('/delete')
  removeFromMenu(@Body() data) {
    console.log(data);
    return this.addToMenuService.removeValueFromMenuList(data);
  }
}
