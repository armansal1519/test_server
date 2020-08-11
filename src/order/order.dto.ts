import { IsDateString, IsNotEmpty } from 'class-validator';

export class OrderDto {
  @IsDateString()
  dateOfOrder: Date;

  @IsDateString()
  dateOfShipping: Date;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  handlerId: string;

  @IsNotEmpty()
  startNodeId: string;

  @IsNotEmpty()
  endNodeId: string;
}
