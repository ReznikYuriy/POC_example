import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsString } from 'class-validator';

export class OutputTripDto {
  @ApiProperty({
    type: Number,
  })
  @IsInt()
  id: number;

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
}
