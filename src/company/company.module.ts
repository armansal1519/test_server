import { CacheModule, Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Arango } from '../arango/Arango';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  // imports: [
  //   CacheModule.register({
  //     store: redisStore,
  //     host: 'localhost',
  //     port: 7001,
  //     ttl: 30, // seconds
  //   }),
  // ],
  controllers: [CompanyController],
  providers: [CompanyService, Arango],
  exports: [CompanyService],
})
export class CompanyModule {}
