import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Arango } from '../arango/Arango';
import { ProductModule } from '../product/product.module';
import { Zarinpal } from './zarinpal';

@Module({
  imports: [ProductModule],
  controllers: [OrderController],
  providers: [OrderService, Arango, Zarinpal],
})
export class OrderModule {}
