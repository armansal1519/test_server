import { Module } from '@nestjs/common';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
import { HttpClass } from './http';
import { Arango } from '../arango/Arango';

@Module({
  controllers: [UserAuthController],
  providers: [UserAuthService, HttpClass, Arango],
  exports:[UserAuthService]
})
export class UserAuthModule {}
