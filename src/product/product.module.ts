import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Arango } from '../arango/Arango';

@Module({
  controllers: [ProductController],
  providers: [Arango, ProductService],
  exports: [ProductService],
})
export class ProductModule {}
