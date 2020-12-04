import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AccessGuard } from '../user-auth/access.guard';
import { UserService } from './user.service';
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
  @Access('all', 'user')
  @Put('/:key')
  put(@Body() data, @Param('key') key) {
    return this.userService.updateUser(data, key);
  }

  @UseGuards(GetYourselfGuard)
  @getYourSelf('admin')
  @Access('all', 'user')
  @Post('/:key/fav')
  addFavorite(@Param('key') userKey, @Body() data) {
    const { productKey } = data;
    return this.userService.addFavorite(userKey, productKey);
  }

  @UseGuards(GetYourselfGuard)
  @getYourSelf('admin')
  @Access('all', 'user')
  @Post('/:key/remove-fav')
  removeFavorite(@Param('key') userKey, @Body() data) {
    const { productKey } = data;
    return this.userService.removeFav(userKey, productKey);
  }

  @UseGuards(GetYourselfGuard)
  @getYourSelf('admin')
  @Delete('/:key')
  delete(@Param('key') key) {
    return this.userService.deleteUser(key);
  }
}
