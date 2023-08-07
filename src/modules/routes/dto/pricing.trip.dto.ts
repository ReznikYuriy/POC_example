import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

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
  /* 
  @ApiProperty({
    type: String,
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  passengers?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  vehicles?: number;

  @ApiProperty({
    type: String,
  })
  @IsString()
  company: string;
 */
}
