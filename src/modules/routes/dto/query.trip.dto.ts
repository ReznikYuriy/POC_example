import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class TripsQueryDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  location_origin: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  location_destination: string;

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

  /* @ApiProperty({
      required: false,
      type: Number,
    })
    @IsInt()
    pets?: number; */

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  isRandom?: boolean;
}
