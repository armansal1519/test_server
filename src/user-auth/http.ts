import { HttpService, Injectable } from '@nestjs/common';
import { smsTokenData } from '../utils/auth/constans';
import axios from 'axios';

@Injectable()
export class HttpClass {
  async getSmsToken() {
    const res = await axios.post(
      smsTokenData.smsTokenUrl,
      {
        UserApiKey: smsTokenData.sms_UserApiKey,
        SecretKey: smsTokenData.sms_SecretKey,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    if (res.data.IsSuccessful == true) {
      // console.log('got token');
      return res.data.TokenKey;
    }

    return 'UnSuccessful request';
  }

  async sendValidCodeFunc(phoneNumber: string, validCode: string) {
    const res = await axios.post(
      '      https://RestfulSms.com/api/VerificationCode',
      {
        Code: validCode,
        MobileNumber: phoneNumber,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-sms-ir-secure-token': smsTokenData.tokenKey,
        },
      },
    );

    res.data['phoneNumber'] = phoneNumber;

    return res.data;
  }
}
