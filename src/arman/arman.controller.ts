import { Body, Controller, Get ,Post } from '@nestjs/common';
import { ArmanService } from './arman.service';
import { ArmanDto } from './arman.dto';

@Controller('arman')
export class ArmanController {
  constructor(
    private armanService:ArmanService
  ) {
  }

  @Get()
  get(){
    return this.armanService.get()
  }

  @Post()
  create(@Body() data :ArmanDto){
    return this.armanService.create(data)
  }
}
