import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
  refreshCol;

  constructor(private arango: Arango, private httpClass: HttpClass) {
    this.tempUserCol = arango.getCol('tempUsers');
    this.userCol = arango.getCol('users');
    this.forgotPasswordCol = arango.getCol('forgotPassword');
    this.refreshCol = arango.getCol('refreshToken');
  }

  async sendValidationCode(data) {
    const { phoneNumber } = data;
    await this.arango.phoneNumberBeUnique(this.tempUserCol, phoneNumber);
    await this.arango.phoneNumberBeUnique(this.userCol, phoneNumber);
    const validationCode = this.generateValidationCode();
    await this.sendValidCode(phoneNumber, validationCode);
    await this.saveTempUser(phoneNumber, validationCode);

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

  async saveTempUser(phoneNumber, validationCode) {
    const data = {
      phoneNumber,
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
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    setTimeout(() => {
      that.arango.executeEmptyQuery(query);
    }, 59 * 1000);

    return returnData;
  }

  async register(phoneNumber, password) {
    const tempUser = await this.arango.getByPhoneNumber(
      this.tempUserCol,
      phoneNumber,
    );
    if (!tempUser[0]) {
      throw new NotFoundException('not found in temp user');
    }
    const hashPass = await argon2.hash(password);
    const access = ['user'];
    const data = {
      phoneNumber,
      hashPass,
      access,
    };

    const newUser = await this.arango.create(this.userCol, data);
    // console.log(newUser);
    const payload = {
      _key: newUser[0]._key,
    };
    const accessToken = this.createAccessToken(payload);
    const refreshToken = this.createRefreshToken(payload);

    delete newUser[0]['hashPass'];

    return {
      user: newUser[0],
      accessToken: accessToken,
      refreshToken: refreshToken,

      expiresIn: '2h',
    };
  }

  async login(phoneNumber, pass) {
    const user = await this.validateUser(phoneNumber, pass);

    if (!user) {
      throw new UnauthorizedException(
        `user with phone number:${phoneNumber} not found`,
      );
    }

    const payload = {
      _key: user._key,
    };
    const accessToken = await this.createAccessToken(payload);
    const refreshToken = await this.createRefreshToken(payload);
    // console.log(1,refreshToken);

    return {
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresIn: '2h',
      authTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
    };
  }

  async doesUserExist(phoneNumber) {
    try {
      const user = await this.arango.getByPhoneNumber(
        this.userCol,
        phoneNumber,
      );
      return { login: true, name: user[0].fullName };
    } catch (err) {
      const resp = await this.sendValidationCode({ phoneNumber: phoneNumber });
      resp['login'] = false;
      return resp;
    }
  }

  async validateUser(phoneNumber: string, pass: string) {
    const user = await this.arango.getByPhoneNumber(this.userCol, phoneNumber);

    // console.log(user);
    const match = await argon2.verify(user[0].hashPass, pass);
    // const match=pass==user[0].pass
    // console.log('match', match);



    if (user && match) {
      const { pass, ...u } = user[0];

      // console.log('in if');
      return u;
    }
    // return null;
    throw new UnauthorizedException('wrong username or password')
  }

  async forgotPassword(phoneNumber) {
    const validationCode = this.generateValidationCode();
    let user;
    await this.arango.phoneNumberBeUnique(this.forgotPasswordCol, phoneNumber);
    try {
      user = await this.arango.getByPhoneNumber(this.userCol, phoneNumber);
    } catch (e) {
      throw new NotFoundException(`phone number didnt register`);
    }
    const data = {
      phoneNumber,
      validationCode,
    };
    await this.sendValidCode(phoneNumber, validationCode);
    await this.arango.create(this.forgotPasswordCol, data);

    const query = aql`for t in forgotPassword
filter t.phoneNumber==${phoneNumber}
remove t in forgotPassword`;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    setTimeout(() => {
      that.arango.executeEmptyQuery(query);
    }, 58 * 1000);

    return phoneNumber;
  }

  async resetPassword(phoneNumber, code) {
    const u = await this.arango.getByPhoneNumber(
      this.forgotPasswordCol,
      phoneNumber,
    );

    if (u[0].validationCode === code) {
      // const newHashPassword = await argon2.hash(password);
      const user = await this.arango.getByPhoneNumber(
        this.userCol,
        phoneNumber,
      );
      // console.log(user);
      const key = user[0]._key;
      const token = this.createAccessToken({ _key: key });
      const refreshToken = await this.createRefreshToken({ _key: key });
      // console.log('in reset pass',refreshToken);
      delete user[0].hashPass;
      return {
        accessToken: token,
        user: user[0],
        refreshToken: refreshToken,
      };
    }
    throw new ConflictException();
  }
  async patchNameAndPassword(data, key) {
    const { password, fullName, email } = data;
    const hashPass = await argon2.hash(password);
    return this.arango.update(
      this.userCol,
      { fullName: fullName, hashPass: hashPass, email: email },
      key,
    );
  }

  async changePasswordByLastPassword(userKey, newPass, oldPass) {
    const arangoResp = await this.arango.getByKey(this.userCol, userKey);
    const curPass = arangoResp[0].hashPass;
    const check = await argon2.verify(curPass, oldPass);
    console.log(check);
    if (check) {
      const newHashPass = await argon2.hash(newPass);
      console.log(newHashPass);
      await this.arango.update(
        this.userCol,
        {
          hashPass: newHashPass,
        },
        userKey,
      );
      return;
    } else {
      throw new ConflictException('old pass is wrong');
    }
  }

  async refreshToken(token) {
    const payload = await jwt.verify(token, jwtConstant.refreshTokenSecret);
    const query = `for u in refreshToken
filter u.userKey=="${payload._key}"
return u`;
    let data;
    try {
      data = await this.arango.executeGetQuery(query);
    } catch (err) {
      throw new UnauthorizedException('refresh token do not exist');
    }

    delete payload['iat'];
    return this.createAccessToken(payload);
  }

  createAccessToken(payload) {
    const Token: string = jwt.sign(payload, jwtConstant.accessTokenSecret, {
      expiresIn: '2h',
    });

    return Token;
  }

  async createRefreshToken(payload) {
    const refreshToken: string = jwt.sign(
      payload,
      jwtConstant.refreshTokenSecret,
    );
    // console.log(2,payload);

    const query = `for u in refreshToken
filter u.userKey=="${payload._key}"
return u`;

    // const data=await this.arango.executeGetQuery(query)
    try {
      const data = await this.arango.executeGetQuery(query);
      console.log('in refresh', data[0].refreshToken);
      return data[0].refreshToken;
    } catch (err) {
      await this.arango.create(this.refreshCol, {
        userKey: payload._key,
        refreshToken: refreshToken,
      });
      return refreshToken;
    }
  }

  generateValidationCode() {
    return (
      Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000
    ).toString();
  }
}
