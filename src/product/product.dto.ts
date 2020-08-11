import { IsNotEmpty } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  desc: string;

  @IsNotEmpty()
  picUrl: string;

  @IsNotEmpty()
  numberInStock: number;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  brand: string;

  @IsNotEmpty()
  categories: [string];
}
