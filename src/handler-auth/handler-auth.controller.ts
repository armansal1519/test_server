import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { Arango } from '../arango/Arango';
import { UserService } from '../user/user.service';
import { UserAuthService } from '../user-auth/user-auth.service';
import * as argon2 from 'argon2';

@Controller('handler-auth')
export class HandlerAuthController {
  userCol;
  constructor(
    private arango: Arango,
    private userService: UserService,
    private userAuthService: UserAuthService,
  ) {
    this.userCol = arango.getCol('users');
  }

  @Post('login')
  async loginHandler(@Body() data) {
    const { phoneNumber, password } = data;
    const user = await this.userService.getUserByPhoneNumber(phoneNumber);
    console.log(user);
    const access = user[0].access;
    for (let i = 0; i < access.length; i++) {
      if (access[i] === 'handler') {
        return this.userAuthService.login(phoneNumber, password);
      }
    }
    throw new UnauthorizedException('user is not handler');
  }

  @Post('register')
  async registerHandler(@Body() data) {
    const { phoneNumber } = data;
    await this.arango.phoneNumberBeUnique(this.userCol, phoneNumber);
    const randomPassword = Math.random()
      .toString(36)
      .slice(-10);
    const hashPassword = await argon2.hash(randomPassword);
    data.access.push('handler');
    data['hashPass'] = hashPassword;

    this.userService.createUser(data);
    return { password: randomPassword };
  }
}
