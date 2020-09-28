import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AccessGuard } from '../user-auth/access.guard';
import { UserService } from './user.service';
import { ProductDto } from '../product/product.dto';
import { GetYourselfGuard } from '../user-auth/get-yourself.guard';
import { getYourSelf } from '../utils/auth/get-yourself.decorator';
import { Access } from '../utils/auth/access.decorator';

@UseGuards(AccessGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Access('handler')
  @Get()
  get() {
    return this.userService.getUser();
  }

  @UseGuards(GetYourselfGuard)
  @getYourSelf('admin')
  @Get('/:key')
  getByKey(@Param('key') key) {
    return this.userService.getUserByKey(key);
  }
  @UseGuards(GetYourselfGuard)
  @getYourSelf('admin')
  @Put('/:key')
  put(@Body() data: ProductDto, @Param('key') key) {
    return this.userService.updateUser(data, key);
  }

  @UseGuards(GetYourselfGuard)
  @getYourSelf('admin')
  @Delete('/:key')
  delete(@Param('key') key) {
    return this.userService.deleteUser(key);
  }
}
