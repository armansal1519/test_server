import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AddToMenuService } from './add-to-menu.service';
import { AccessGuard } from '../user-auth/access.guard';
import { Access } from '../utils/auth/access.decorator';
import { Arango } from '../arango/Arango';

@Controller('menu')
export class AddToMenuController {
  constructor(
    private addToMenuService: AddToMenuService,
    private arango: Arango,
  ) {}

  @Get()
  async getAllMenu(@Query('name') name) {
    if (name === 'menu') {
      const query = `for c in company 
        return c.name`;
      const company = await this.arango.executeGetQuery(query);
      const menu = await this.addToMenuService.getMenu();
      return [Object.assign({ company: company }, menu[0])];
    } else {
      return this.addToMenuService.getMenu();
    }
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
