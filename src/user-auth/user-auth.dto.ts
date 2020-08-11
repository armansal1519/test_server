import { IsNotEmpty } from 'class-validator';

export class GetValidationCodeDto {
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  password: string;
}
