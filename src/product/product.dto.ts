import { IsNotEmpty } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  company: string;
  @IsNotEmpty()
  coverSelect: string;
  @IsNotEmpty()
  sheetSelect: string[];
  @IsNotEmpty()
  dimensionsSelect: string[];
  @IsNotEmpty()
  thicknessSelect: string;
  @IsNotEmpty()
  sheetCountry: string;
  @IsNotEmpty()
  coverCountry: string;
  @IsNotEmpty()
  code: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  numberInPalet: string;
  @IsNotEmpty()
  quality: string;
  @IsNotEmpty()
  status: string;
  @IsNotEmpty()
  imageUrl: string[];
  @IsNotEmpty()
  sideSheetType: string[];
  @IsNotEmpty()
  desc: string;
}
