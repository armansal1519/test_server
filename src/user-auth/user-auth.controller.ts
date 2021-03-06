import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import {
  ChangePass,
  GetValidationCodeDto,
  LoginRegister,
  PatchNameAndHash,
} from './user-auth.dto';

@Controller('user-auth')
export class UserAuthController {
  constructor(private userAuthService: UserAuthService) {}

  @Post('get-validation-code')
  getValidationCode(@Body() data: GetValidationCodeDto) {
    return this.userAuthService.sendValidationCode(data);
  }

  @Post('/login-register')
  loginRegister(@Body() data: LoginRegister) {
    const { phoneNumber } = data;
    return this.userAuthService.doesUserExist(phoneNumber);
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

  @Post('/change-password/:key')
  changePass(@Param('key') key, @Body() data: ChangePass) {
    const { oldPass, newPass } = data;
    return this.userAuthService.changePasswordByLastPassword(
      key,
      newPass,
      oldPass,
    );
  }

  @Patch('/info/:key')
  patchNameAndHashPass(@Body() data: PatchNameAndHash, @Param('key') key) {
    return this.userAuthService.patchNameAndPassword(data, key);
  }

  @Post('refresh')
  refreshToken(@Body() data) {
    const { token } = data;
    return this.userAuthService.refreshToken(token);
  }
}
