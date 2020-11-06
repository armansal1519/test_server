import { IsNotEmpty } from 'class-validator';

export class GetValidationCodeDto {
  @IsNotEmpty()
  phoneNumber: string;
}

export class PatchNameAndHash {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  password: string;

  email: string | string;
}
