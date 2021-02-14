import { isNotEmpty, IsNotEmpty } from 'class-validator';

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

export class ChangePass {
  @IsNotEmpty()
  oldPass: string;

  @IsNotEmpty()
  newPass: string;
}

export class LoginRegister {
  @IsNotEmpty()
  phoneNumber: string;
}
