import { IsNotEmpty } from 'class-validator';

export class GetValidationCodeDto {
  @IsNotEmpty()
  phoneNumber: string;


}
