import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumberString,
  IsString,
  IsArray,
} from 'class-validator';
import PassengerAccommodationInterface from '../shemas/passenger.accomodation.interface';
import VehicleAccommodationInterface from '../shemas/vehicle.accomodation.interface';

export class PricingTripDto {
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
    type: [PassengerAccommodationInterface],
  })
  @IsArray()
  passengers: [PassengerAccommodationInterface];

  @ApiProperty({
    type: [VehicleAccommodationInterface],
  })
  @IsArray()
  vehicles: [VehicleAccommodationInterface];
}
