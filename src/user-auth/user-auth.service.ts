import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Arango } from '../arango/Arango';
import { HttpClass } from './http';
import * as jwt from 'jsonwebtoken';

import { jwtConstant, smsTokenData } from '../utils/auth/constans';
import * as argon2 from 'argon2';
import { aql } from 'arangojs';

@Injectable()
export class UserAuthService {
  tempUserCol;
  userCol;
  forgotPasswordCol;

  constructor(private arango: Arango, private httpClass: HttpClass) {
    this.tempUserCol = arango.getCol('tempUsers');
    this.userCol = arango.getCol('users');
    this.forgotPasswordCol = arango.getCol('forgotPassword');
  }

  async sendValidationCode(data) {
    const { phoneNumber, password } = data;
    await this.arango.phoneNumberBeUnique(this.tempUserCol, phoneNumber);
    await this.arango.phoneNumberBeUnique(this.userCol, phoneNumber);
    const validationCode = this.generateValidationCode();
    await this.sendValidCode(phoneNumber, validationCode);
    await this.saveTempUser(phoneNumber, password, validationCode);

    return { phoneNumber, validationCode };
  }

  async sendValidCode(phoneNumber: string, code: string) {
    if (smsTokenData.isTokenFresh === false) {
      smsTokenData.tokenKey = await this.httpClass.getSmsToken();
      smsTokenData.isTokenFresh = true;
      setTimeout(() => (smsTokenData.isTokenFresh = false), 1800000);
    }

    return await this.httpClass.sendValidCodeFunc(phoneNumber, code);
  }

  async saveTempUser(phoneNumber, pass, validationCode) {
    const hashPass = await argon2.hash(pass);

    const data = {
      phoneNumber,
      hashPass,
      validationCode,
    };

    await this.arango.create(this.tempUserCol, data);

    const returnData = {
      phoneNumber,
      validationCode,
    };
    const query = aql`for t in tempUsers
filter t.phoneNumber==${phoneNumber}
remove t in tempUsers`;
    const that = this;
    setTimeout(() => {
      that.arango.executeEmptyQuery(query);
    }, 2 * 60 * 1000);

    return returnData;
  }

  async register(phoneNumber) {
    const tempUser = await this.arango.getByPhoneNumber(
      this.tempUserCol,
      phoneNumber,
    );
    const { hashPass } = tempUser[0];
    const access = ['user'];
    const data = {
      phoneNumber,
      hashPass,
      access,
    };

    const newUser = await this.arango.create(this.userCol, data);
    console.log(newUser);
    const payload = {
      _key: newUser[0]._key,
    };
    const accessToken = this.createAccessToken(payload);

    return {
      accessToken: accessToken,
      expiresIn: '2h',
    };
  }

  async login(phoneNumber, pass) {
    const user = await this.validateUser(phoneNumber, pass);
    console.log('79', user);

    if (!user) {
      throw new UnauthorizedException(
        `user with phone number:${phoneNumber} not found`,
      );
    }

    const payload = {
      _key: user._key,
    };
    const accessToken = this.createAccessToken(payload);

    return {
      accessToken: accessToken,
      expiresIn: '2h',
    };
  }

  async validateUser(phoneNumber: string, pass: string) {
    const user = await this.arango.getByPhoneNumber(this.userCol, phoneNumber);

    console.log(user);
    const match = await argon2.verify(user[0].hashPass, pass);
    // const match=pass==user[0].pass
    console.log('match', match);
    if (user && match) {
      const { pass, ...u } = user[0];

      console.log('in if');
      return u;
    }
    return null;
  }

  async forgotPassword(phoneNumber){
    const validationCode= this.generateValidationCode()
    let user
    await this.arango.phoneNumberBeUnique(this.forgotPasswordCol, phoneNumber);
    try {
      user=await this.arango.getByPhoneNumber(this.userCol,phoneNumber)

    }catch (e) {
      throw new NotFoundException(`phone number didnt register`)
    }
    const data={
      phoneNumber,
      validationCode
    }
    await this.sendValidCode(phoneNumber,validationCode)
    await this.arango.create(this.forgotPasswordCol,data)

    const query = aql`for t in forgotPassword
filter t.phoneNumber==${phoneNumber}
remove t in forgotPassword`;
    const that = this;
    setTimeout(() => {
      that.arango.executeEmptyQuery(query);
    }, 2 * 60 * 1000);

    return phoneNumber
  }

  async resetPassword(phoneNumber,code){
    const u= await this.arango.getByPhoneNumber(this.forgotPasswordCol,phoneNumber)

    if (u[0].validationCode===code){
      const newHashPassword= await argon2.hash(code)
      const user=await this.arango.getByPhoneNumber(this.userCol,phoneNumber)
      console.log(user);
      const key=user[0]._key
      return this.arango.update(this.userCol,{hashPass:newHashPassword},key)
    }
    throw new ConflictException()
  }

  createAccessToken(payload) {
    const accessToken: string = jwt.sign(
      payload,
      jwtConstant.accessTokenSecret,
      { expiresIn: '2h' },
    );
    return accessToken;
  }

  generateValidationCode() {
    return (
      Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000
    ).toString();
  }
}
