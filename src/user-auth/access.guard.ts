import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtConstant } from 'src/utils/auth/constans';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { Arango } from '../arango/Arango';

@Injectable()
export class AccessGuard implements CanActivate {
  userCol;
  arango;
  constructor(private reflector: Reflector) {
    this.arango = new Arango();
    this.userCol = this.arango.getCol('users');
  }

  async canActivate(context: ExecutionContext) {
    const access = this.reflector.get<string[]>('access', context.getHandler());
    // console.log('show acces in access gurd', access);
    const req = context.switchToHttp().getRequest();
    console.log('in');
    const authHeader = req.headers.authorization;
    console.log(access);

    if(!authHeader && access.includes('all')){
      return true
    }
    const userAccess: string[] = await this.headerToAccessPayload(authHeader);

    if (!access) {
      return true;
    }

    let accessError = true;
    for (let i = 0; i < access.length; i++) {
      for (let j = 0; j < userAccess.length; j++) {
        if (userAccess[j] === access[i]) {
          accessError = false;
          return true;
        }
      }
    }
    if (accessError) {
      throw new ConflictException('access error');
    }
    return false;
  }

  async headerToAccessPayload(authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('header does not exist! ' + authHeader);
    }
    const token = authHeader.split(' ')[1];

    // console.log(token);
    let result;

    try {
      result = jwt.verify(token, jwtConstant.accessTokenSecret);
    } catch (err) {
      throw new UnauthorizedException(err);
    }
    // console.log(result);
    const { _key } = result;

    // console.log(_key);
    const user = await this.arango.getByKey(this.userCol, _key);
    // console.log(user);
    return user[0].access;
  }
}
