import { IsNotEmpty } from 'class-validator';

export class ContactDto {
  fullName: string;

  email: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  text: string;

  filePath: string;
}

export class UpdateContactDto {
  @IsNotEmpty()
  isAnswered: boolean;
}
