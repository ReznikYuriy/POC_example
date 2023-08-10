import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsInt, IsOptional, IsString } from 'class-validator';
import TripAccommodationInterface from '../shemas/trip.accomodation.interface';

export class CreateTripDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  loc_origin: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  loc_destination: string;

  @ApiProperty({
    type: Date,
  })
  @IsDate()
  date_start: Date;

  @ApiProperty({
    type: Date,
  })
  @IsDate()
  date_end: Date;

  @ApiProperty({
    type: Number,
  })
  @IsInt()
  duration: number;

  @ApiProperty({
    type: String,
  })
  @IsString()
  company: string;

  @ApiProperty({
    type: Number,
  })
  @IsInt()
  price_basic: number;

  @ApiProperty({
    type: Number,
  })
  @IsInt()
  price_discount: number;

  @ApiProperty({
    //required: false,
    type: String,
  })
  //@IsOptional()
  @IsString()
  company_id: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  vessel_id: string;

  @ApiProperty({
    type: [TripAccommodationInterface],
  })
  @IsArray()
  accommodations: TripAccommodationInterface[];
}
