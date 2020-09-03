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

@UseGuards(AccessGuard)
@UseGuards(GetYourselfGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  get() {
    return this.userService.getUser();
  }

  @getYourSelf('admin')
  @Get('/:key')
  getByKey(@Param('key') key) {
    return this.userService.getUserByKey(key);
  }

  @Put('/:key')
  put(@Body() data: ProductDto, @Param('key') key) {
    return this.userService.updateUser(data, key);
  }

  @Delete('/:key')
  delete(@Param('key') key) {
    return this.userService.deleteUser(key);
  }
}
