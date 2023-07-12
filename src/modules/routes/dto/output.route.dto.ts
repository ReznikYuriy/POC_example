import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OutputRouteDto {
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
    type: String,
  })
  @IsString()
  description: string;
}
