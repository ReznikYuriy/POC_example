import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export default class VehicleAccommodationInterface {
  @ApiProperty({
    type: 'string',
    example: 'MTC',
  })
  @IsString()
  accommodation_id: string;

  @ApiProperty({
    required: false,
    type: 'number',
    example: 425,
  })
  @IsNumber()
  @IsOptional()
  length?: number;
}
