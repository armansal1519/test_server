import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Arango } from '../arango/Arango';
import { ProductModule } from '../product/product.module';

@Module({
  imports:[ProductModule],
  controllers: [UserController],
  providers: [UserService, Arango],

  exports: [UserService],
})
export class UserModule {}
