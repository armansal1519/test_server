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
import { OrderService } from './order.service';
import { OrderDto } from './order.dto';
import { AccessGuard } from '../user-auth/access.guard';

@UseGuards(AccessGuard)
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
  post(@Body() data: OrderDto) {
    const { startNodeId, endNodeId } = data;
    return this.orderService.createOrder(data, startNodeId, endNodeId);
  }

  @Put(':key')
  put(@Body() data: OrderDto, @Param('key') key) {
    return this.orderService.updateOrder(key, data);
  }

  @Delete(':key')
  delete(@Param('key') key) {
    return this.orderService.deleteOrder(key);
  }
}
