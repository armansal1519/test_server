import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Arango } from '../arango/Arango';

@Module({
  controllers: [OrderController],
  providers: [OrderService, Arango],
})
export class OrderModule {}
