import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class OrderDto {
  @IsDateString()
  dateOfOrder: Date;

  // @IsDateString()
  // dateOfShipping: Date;

  // @IsNotEmpty()
  // status: string;

  // @IsNotEmpty()
  // handlerId: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  index: number;

  @IsNotEmpty()
  number: number;

  @IsNotEmpty()
  addressIndex: number;

  addInfo: string;

  @IsNotEmpty()
  paymentMethod: string;

  @IsNotEmpty()
  sendMethod: string;
}

export class HeadlessOrderDto {
  @IsDateString()
  dateOfOrder: Date;

  // @IsDateString()
  // dateOfShipping: Date;

  // @IsNotEmpty()
  // status: string;

  // @IsNotEmpty()
  // handlerId: string;



  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  index: number;

  @IsNotEmpty()
  number: number;

  @IsNotEmpty()
  addressName: string;

  @IsNotEmpty()
  addressPhoneNumber: string;


  @IsNotEmpty()
  addressText: string;

  @IsNotEmpty()
  addressCode: string;



  addInfo: string;

  @IsNotEmpty()
  paymentMethod: string;

  @IsNotEmpty()
  sendMethod: string;
}


// class Address {
//   name:string
//
//   phoneNumber:string
//
//   text:string
//
//   code:string
// }