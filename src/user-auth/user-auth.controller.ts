import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { GetValidationCodeDto } from './user-auth.dto';

@Controller('user-auth')
export class UserAuthController {
  constructor(private userAuthService: UserAuthService) {}

  @Post('get-validation-code')
  getValidationCode(@Body() data: GetValidationCodeDto) {
    return this.userAuthService.sendValidationCode(data);
  }

  @Post('register')
  register(@Body() data) {
    const { phoneNumber, password } = data;
    return this.userAuthService.register(phoneNumber, password);
  }

  @Post('login')
  login(@Body() data) {
    const { phoneNumber, password } = data;
    return this.userAuthService.login(phoneNumber, password);
  }

  @Post('forgot-password')
  forgotPassword(@Body() data) {
    const { phoneNumber } = data;
    return this.userAuthService.forgotPassword(phoneNumber);
  }

  @Post('reset-password')
  resetPassword(@Body() data) {
    const { phoneNumber, code } = data;
    return this.userAuthService.resetPassword(phoneNumber, code);
  }
}
