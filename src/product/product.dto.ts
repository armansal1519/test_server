import { IsNotEmpty } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  company: string;
  @IsNotEmpty()
  coverSelect: string;
  @IsNotEmpty()
  sheetSelect: string;
  @IsNotEmpty()
  dimensionsSelect: string[];
  @IsNotEmpty()
  thicknessSelect: string;
  @IsNotEmpty()
  sheetCountry: string;
  @IsNotEmpty()
  coverCountry: string;
  @IsNotEmpty()
  colorCode: string;
  @IsNotEmpty()
  color: string;
  @IsNotEmpty()
  numberInPalet: string;
  @IsNotEmpty()
  quality: string;
  @IsNotEmpty()
  status: string;
  @IsNotEmpty()
  imageUrl: string[];
  @IsNotEmpty()
  sideSheetType: string;
  @IsNotEmpty()
  desc: string;
  @IsNotEmpty()
  weight:string
  @IsNotEmpty()
  density:string
  @IsNotEmpty()
  keywords:string[]

}
