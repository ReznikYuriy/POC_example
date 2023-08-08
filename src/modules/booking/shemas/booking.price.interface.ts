import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { PriceAccommodationType } from '../enum/price.accommodation.type.enum';

export default class BookingPriceInterface {
  @ApiProperty({
    type: 'number',
    example: 7100,
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    type: 'number',
    example: 5452,
  })
  @IsNumber()
  net: number;

  @ApiProperty({
    type: 'number',
    example: 1648,
  })
  @IsNumber()
  tax: number;

  @ApiProperty({
    type: 'string',
    example: `${PriceAccommodationType.PASSENGER}`,
  })
  @IsEnum(PriceAccommodationType)
  priceAccommodationType: PriceAccommodationType;

  @ApiProperty({
    type: 'string',
    example: 'CAR',
  })
  @IsString()
  itemIdOrCode: string;

  @ApiProperty({
    type: 'string',
    example: 'IX1',
  })
  @IsString()
  crsCode: string;
}
