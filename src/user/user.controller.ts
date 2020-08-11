import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AccessGuard } from '../user-auth/access.guard';
import { UserService } from './user.service';
import { ProductDto } from '../product/product.dto';

@UseGuards(AccessGuard)
@Controller('user')
export class UserController {

  constructor(
    private userService:UserService
  ) {
  }

  @Get()
  get(){
    return  this.userService.getUser()



  }

  @Get('/:key')
  getByKey(@Param('key') key)
  {
    return this.userService.getUserByKey(key)
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
