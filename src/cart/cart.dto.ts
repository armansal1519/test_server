import { IsNotEmpty } from 'class-validator';

export class AddCartDto {
  @IsNotEmpty()
  userKey: string;

  @IsNotEmpty()
  productKey: string;

  @IsNotEmpty()
  number: number;

  @IsNotEmpty()
  index: number;
}

export class RemoveCartDto {
  @IsNotEmpty()
  userKey: string;

  @IsNotEmpty()
  productKey: string;

  @IsNotEmpty()
  index:number
}
