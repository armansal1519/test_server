import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompantDto } from './compantDto';
import { Access } from '../utils/auth/access.decorator';
import { AccessGuard } from '../user-auth/access.guard';

@UseGuards(AccessGuard)
@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Access('handler', 'user')
  @Get()
  get() {
    return this.companyService.getCompany();
  }

  @Access('handler', 'user')
  @Get('/:key')
  getByKey(@Param('key') key) {
    return this.companyService.getCompanyByKey(key);
  }

  @Access('handler', 'user')
  @Get('/sheet/:key')
  getSheetFromOneCompany(@Param('key') key) {
    return this.companyService.getSheetFromOneCompany(key);
  }

  @Access('handler')
  @Post()
  post(@Body() data: CompantDto) {
    return this.companyService.createCompany(data);
  }

  @Access('handler')
  @Put('/:key')
  put(@Body() data: CompantDto, @Param('key') key) {
    return this.companyService.updateCompany(data, key);
  }

  @Access('handler')
  @Delete('/:key')
  delete(@Param('key') key) {
    return this.companyService.deleteCompany(key);
  }
}
