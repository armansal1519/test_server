import { Module } from '@nestjs/common';
import { HandlerAuthController } from './handler-auth.controller';

import { Arango } from '../arango/Arango';
import { UserAuthModule } from '../user-auth/user-auth.module';
import { UserModule } from '../user/user.module';

import { HttpClass } from '../user-auth/http';

@Module({
  controllers: [HandlerAuthController],
  imports: [UserAuthModule, UserModule],
  providers:[Arango,HttpClass]
})
export class HandlerAuthModule {}
