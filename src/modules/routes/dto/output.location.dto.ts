import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OutputLocationDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  id: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  name: string;

  /* @ApiProperty({
    type: String,
  })
  @IsString()
  country: string; */
}
