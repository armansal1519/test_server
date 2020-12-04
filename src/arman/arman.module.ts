import { Module } from '@nestjs/common';
import { ArmanController } from './arman.controller';
import { ArmanService } from './arman.service';
import { Arango } from '../arango/Arango';
import { UserAuthModule } from '../user-auth/user-auth.module';

@Module({
  imports: [UserAuthModule],
  controllers: [ArmanController],
  providers: [ArmanService, Arango],
})
export class ArmanModule {}
