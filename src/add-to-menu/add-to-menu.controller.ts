import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AddToMenuService } from './add-to-menu.service';
import { AccessGuard } from '../user-auth/access.guard';

@UseGuards(AccessGuard)
@Controller('add-to-menu')
export class AddToMenuController {
  constructor(private addToMenuService: AddToMenuService) {}

  @Post()
  addNewToMenu(@Body() data) {
    this.addToMenuService.addCompanyNameToMenuList(data);
  }
}
