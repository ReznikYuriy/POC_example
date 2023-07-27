import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateTripDto {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  loc_origin?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  loc_destination?: string;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @IsDate()
  date_start?: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsDate()
  @IsOptional()
  date_end?: Date;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  duration?: number;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  company_id?: string;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  price_basic?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  price_discount?: number;
}
