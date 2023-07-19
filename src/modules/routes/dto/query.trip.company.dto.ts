import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { TripsQueryDto } from './query.trip.dto';

export class TripCompanyQueryDto extends TripsQueryDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  company: string;
}
