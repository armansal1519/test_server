import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './product.dto';
import { AccessGuard } from '../user-auth/access.guard';
import { Access } from '../utils/auth/access.decorator';
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  get(@Query() q) {
    return this.productService.getProduct(q);
  }

  @Post('/filter')
  getFilteredArr(@Body() data, @Query() q) {
    console.log(data, 1);
    console.log(q);
    return this.productService.getFilteredProduct(data, q);
  }

  @Get('/len')
  getLength() {
    return this.productService.getLengthOfProduct();
  }
  @Get('/:key')
  getByKey(@Param('key') key) {
    return this.productService.getProductByKey(key);
  }

  @Get('/fav/:userKey')
  getProductByKeyArray(@Param('userKey') userKey) {
    return this.productService.getProductByKeyArray(userKey);
  }

  @UseGuards(AccessGuard)
  @Access('handler')
  @Post()
  post(@Body() data: ProductDto) {
    console.log(data);
    return this.productService.createProduct(data);
  }
  @UseGuards(AccessGuard)
  @Access('handler')
  @Put('/:key')
  put(@Body() data, @Param('key') key) {
    return this.productService.updateProduct(data, key);
  }

  @UseGuards(AccessGuard)
  @Access('handler')
  @Delete('/:key')
  delete(@Param('key') key) {
    return this.productService.deleteProduct(key);
  }
}
