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
import { ProductService } from './product.service';
import { ProductDto } from './product.dto';
import { AccessGuard } from '../user-auth/access.guard';
import { Access } from '../utils/auth/access.decorator';

@UseGuards(AccessGuard)
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @Access('user')
  get() {
    return this.productService.getProduct();
  }

  @Get('/:key')
  getByKey(@Param('key') key) {
    return this.productService.getProductByKey(key);
  }

  @Post()
  post(@Body() data: ProductDto) {
    return this.productService.createProduct(data);
  }

  @Put(':key')
  put(@Body() data: ProductDto, @Param('key') key) {
    return this.productService.updateProduct(data, key);
  }

  @Delete(':key')
  delete(@Param('key') key) {
    return this.productService.deleteProduct(key);
  }
}
