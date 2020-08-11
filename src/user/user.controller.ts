import { Controller, UseGuards } from '@nestjs/common';
import { AccessGuard } from '../user-auth/access.guard';

@UseGuards(AccessGuard)
@Controller('user')
export class UserController {


}
