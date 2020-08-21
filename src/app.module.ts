import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { UserAuthModule } from './user-auth/user-auth.module';
import { AddToMenuModule } from './add-to-menu/add-to-menu.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    OrderModule,
    ProductModule,
    UserAuthModule,
    AddToMenuModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
