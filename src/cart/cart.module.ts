import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { Arango } from '../arango/Arango';

@Module({
  imports: [UserModule, ProductModule],
  controllers: [CartController],
  providers: [CartService, Arango],
})
export class CartModule {}
