import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { HeadlessOrderDto, OrderDto } from './order.dto';
import { AccessGuard } from '../user-auth/access.guard';

// @UseGuards(AccessGuard)
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}
  @Get()
  get() {
    return this.orderService.getAllOrder();
  }

  @Get('/user/:key')
  getAllOrderOfOneUserByKey(@Param('key') key) {
    return this.orderService.getAllOrderOfOneUser(key);
  }

  @Get('/:key')
  getOrderByKey(@Param('key') key) {
    return this.orderService.getOrderByKey(key);
  }

  @Post()
  post(@Body() data: OrderDto[],@Query()q) {
    return this.orderService.createOrder(data,q);
  }

  @Post('/headless')
  createHeadlessOrder(@Body() data: HeadlessOrderDto) {
    return this.orderService.createHeadLessOrder(data);
  }

  @Get('/v/:orderKey')
  paymentVerification(@Param() param) {
    return this.orderService.validateOrder(param.orderKey);
  }

  @Put(':key')
  put(@Body() data, @Param('key') key) {
    return this.orderService.updateOrder(key, data);
  }

  @Delete(':key')
  delete(@Param('key') key) {
    return this.orderService.deleteOrder(key);
  }
}
