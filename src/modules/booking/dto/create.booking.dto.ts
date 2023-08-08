import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNumberString,
  IsString,
} from 'class-validator';
import BookingPriceInterface from '../shemas/booking.price.interface';

export class CreateBookingDto {
  @ApiProperty({
    type: String,
    example: 'PIR',
  })
  @IsString()
  loc_origin_code: string;

  @ApiProperty({
    type: String,
    example: 'HER',
  })
  @IsString()
  loc_destination_code: string;

  @ApiProperty({
    type: String,
    example: '2023-09-30 21:00',
  })
  @IsDateString()
  departure_date_time: string;

  @ApiProperty({
    type: String,
    example: '2023-09-30 21:00',
  })
  @IsDateString()
  arrival_date_time: string;

  @ApiProperty({
    type: String,
    example: '00014',
  })
  @IsNumberString()
  vessel_id: string;

  @ApiProperty({
    type: String,
    example: 'ANSF',
  })
  @IsString()
  company_code: string;

  @ApiProperty({
    type: [BookingPriceInterface],
  })
  @IsArray()
  prices: [BookingPriceInterface];

  @ApiProperty({
    type: String,
    example: '7289248242',
  })
  @IsNumberString()
  bookingIdentifier: string;
}
