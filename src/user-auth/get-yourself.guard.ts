import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { Arango } from '../arango/Arango';
import { jwtConstant } from '../utils/auth/constans';

@Injectable()
export class GetYourselfGuard implements CanActivate {
  userCol;
  arango;
  constructor(private reflector: Reflector) {
    this.arango = new Arango();
    this.userCol = this.arango.getCol('users');
  }
  async canActivate(context: ExecutionContext) {
    const getYourSelf = this.reflector.get<string[]>(
      'getYourSelf',
      context.getHandler(),
    );
    // console.log('show acces in getYourSelf gurd', getYourSelf);
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    const user = await this.headerToAccessPayload(authHeader);
    const userAccess = user.access;

    if (!getYourSelf) {
      return true;
    }

    if (!req.params) {
      return true;
    }

    if (req.params['key'] == user._key) {
      return true;
    }

    let accessError = true;
    for (let i = 0; i < getYourSelf.length; i++) {
      for (let j = 0; j < userAccess.length; j++) {
        if (userAccess[j] === getYourSelf[i]) {
          accessError = false;
          return true;
        }
      }
    }
    if (accessError) {
      throw new ConflictException('getYourSelf error');
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
    return user[0];
  }
}
