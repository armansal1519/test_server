import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { UserAuthModule } from './user-auth/user-auth.module';
import { AddToMenuModule } from './add-to-menu/add-to-menu.module';
import { UserModule } from './user/user.module';
import { HandlerAuthModule } from './handler-auth/handler-auth.module';
import { UploadImageModule } from './upload-image/upload-image.module';
import { CompanyModule } from './company/company.module';
import { TicketModule } from './ticket/ticket.module';

@Module({
  imports: [
    OrderModule,
    ProductModule,
    UserAuthModule,
    AddToMenuModule,
    UserModule,

    HandlerAuthModule,
    UploadImageModule,
    CompanyModule,
    TicketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
