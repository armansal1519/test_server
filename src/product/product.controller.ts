import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
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

  @Access('handler', 'user')
  @Get()
  get() {
    return this.productService.getProduct();
  }

  @Access('handler', 'user')
  @Get('/:key')
  getByKey(@Param('key') key) {
    return this.productService.getProductByKey(key);
  }
  @Access('handler')
  @Post()
  post(@Body() data: ProductDto) {
    console.log(data);
    return this.productService.createProduct(data);
  }
  @Access('handler')
  @Put('/:key')
  put(@Body() data: ProductDto, @Param('key') key) {
    return this.productService.updateProduct(data, key);
  }

  @Access('handler')
  @Delete('/:key')
  delete(@Param('key') key) {
    return this.productService.deleteProduct(key);
  }
}
