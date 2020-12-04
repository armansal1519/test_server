import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Arango } from '../arango/Arango';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [CompanyModule],
  controllers: [ProductController],
  providers: [Arango, ProductService],
  exports: [ProductService],
})
export class ProductModule {}
