import { IsNotEmpty } from 'class-validator';

export class CompantDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  imageUrl: string;
}
