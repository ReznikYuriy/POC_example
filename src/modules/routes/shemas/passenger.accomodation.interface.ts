import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { SexType } from '../enum/sex.type.enum';

export default class PassengerAccommodationInterface {
  @ApiProperty({
    type: 'string',
    example: 'AB4',
  })
  @IsString()
  accommodation_id: string;

  @ApiProperty({
    type: 'string',
    example: `${SexType.MALE}`,
  })
  @IsEnum(SexType)
  sex: SexType;

  @ApiProperty({
    type: 'string',
    example: 'Adult (age:13 to 99y)',
  })
  @IsString()
  adult_fare: string;
}
