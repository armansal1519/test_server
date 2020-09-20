import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AddToMenuService } from './add-to-menu.service';
import { AccessGuard } from '../user-auth/access.guard';
import { Access } from '../utils/auth/access.decorator';


@Controller('menu')
export class AddToMenuController {
  constructor(private addToMenuService: AddToMenuService) {}

  @Get()
  getAllMenu() {
    return this.addToMenuService.getMenu();
  }
  @UseGuards(AccessGuard)
  @Access('handler')
  @Post('/add')
  addNewToMenu(@Body() data) {
    return this.addToMenuService.addValueToMenuList(data);
  }
  @UseGuards(AccessGuard)
  @Access('handler')
  @Post('/delete')
  removeFromMenu(@Body() data) {
    console.log(data);
    return this.addToMenuService.removeValueFromMenuList(data);
  }
}
