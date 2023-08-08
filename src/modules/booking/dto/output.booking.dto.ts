import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateBookingDto } from './create.booking.dto';

export class OutputBookingDto extends CreateBookingDto {
  @ApiProperty({
    type: 'number',
  })
  @IsNumber()
  id: number;
}
