import { IsNotEmpty } from 'class-validator';

export class ArmanDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  desc: string;
}
