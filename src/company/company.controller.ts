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

@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Get()
  get() {
    return this.companyService.getCompany();
  }

  @Get('/:key')
  getByKey(@Param('key') key) {
    return this.companyService.getCompanyByKey(key);
  }

  @Get('/sheet/:key')
  getSheetFromOneCompany(@Param('key') key) {
    return this.companyService.getSheetFromOneCompany(key);
  }

  @UseGuards(AccessGuard)
  @Access('handler')
  @Post()
  post(@Body() data: CompantDto) {
    return this.companyService.createCompany(data);
  }

  @UseGuards(AccessGuard)
  @Access('handler')
  @Put('/:key')
  put(@Body() data: CompantDto, @Param('key') key) {
    return this.companyService.updateCompany(data, key);
  }

  @UseGuards(AccessGuard)
  @Access('handler')
  @Delete('/:key')
  delete(@Param('key') key) {
    return this.companyService.deleteCompany(key);
  }
}
