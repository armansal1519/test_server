import { Body, Controller, Delete, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { UpdateCartDto } from './cart.dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  addToCart(@Body() data) {
    return this.cartService.addToCart(data);
  }
  @Post('/update')
  updateToCart(@Body() data:UpdateCartDto) {
    return this.cartService.updateCart(data);
  }

  @Post('/delete')
  removeFromCart(@Body() data) {
    console.log(data);
    return this.cartService.removeFromCart(data);
  }
}
