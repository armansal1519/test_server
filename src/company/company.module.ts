import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Arango } from '../arango/Arango';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, Arango],
})
export class CompanyModule {}
