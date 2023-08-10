import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { PriceAccommodationType } from 'src/modules/booking/enum/price.accommodation.type.enum';

export default class TripAccommodationInterface {
  @ApiProperty({
    type: 'string',
    example: 'AB4',
  })
  @IsString()
  accommodation_id: string;

  @ApiProperty({
    type: 'string',
    example: 'CABIN',
  })
  @IsString()
  availabilityType: string;

  @ApiProperty({
    type: 'string',
    example: `${PriceAccommodationType.PASSENGER}`,
  })
  @IsEnum(PriceAccommodationType)
  type: PriceAccommodationType;

  @ApiProperty({
    type: 'string',
    example: '4-Berth-Inside-Cabin',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'number',
  })
  @IsString()
  adultBasePrice: number;

  @ApiProperty({
    type: 'number',
  })
  @IsString()
  wholeBerthAvailability: number;

  @ApiProperty({
    type: 'number',
  })
  @IsString()
  maleBerthAvailability: number;

  @ApiProperty({
    type: 'number',
  })
  @IsString()
  femaleBerthAvailability: number;
}
