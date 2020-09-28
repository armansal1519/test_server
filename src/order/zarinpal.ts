const ZarinpalCheckout = require('zarinpal-checkout');
import { BadRequestException, ConflictException } from '@nestjs/common';

export class Zarinpal {
  async createPaymentLink(data) {
    const zarinpal = ZarinpalCheckout.create(
      'f549233f-88f0-45ec-9a9f-a67eba4287f6',
      false,
    );
    const resp = await zarinpal.PaymentRequest(data);
    if (resp.status === 100) {
      return resp;
    }
    throw new BadRequestException('error in zarinpal cratePaymentLink');
  }

  async paymentVerification(data) {
    const zarinpal = ZarinpalCheckout.create(
      'f549233f-88f0-45ec-9a9f-a67eba4287f6',
      false,
    );

    const resp = await zarinpal.PaymentVerification(data);
    if (resp.status === -21) {
      throw new ConflictException('payment is not valid');
    }
    return resp;
  }
}
