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
  sendMethod:string
}
