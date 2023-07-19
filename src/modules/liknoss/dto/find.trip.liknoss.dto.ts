import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsObject, IsString } from 'class-validator';

class QuoteRequestDto {
  @ApiProperty({
    type: Number,
  })
  @IsInt()
  passengers: number;

  @ApiProperty({
    type: Number,
  })
  @IsInt()
  vehicles: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsInt()
  pets?: number;
}

export class FindTripLiknossDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  departureDate: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  originIdOrCode: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  destinationIdOrCode: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  sorting: string;

  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  availabilityInformation: boolean;

  @ApiProperty({
    type: QuoteRequestDto,
  })
  @IsObject()
  quoteRequest: QuoteRequestDto;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsBoolean()
  fetchVehicleAccommodations?: boolean;
}
