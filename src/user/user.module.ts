import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Arango } from '../arango/Arango';

@Module({
  controllers: [UserController],
  providers: [UserService, Arango],
  exports:[UserService]
})
export class UserModule {}
