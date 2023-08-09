import { Controller, Get, Post, Body } from '@nestjs/common';
import { BookingService } from './services/booking.service';
import { CreateBookingDto } from './dto/create.booking.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OutputBookingDto } from './dto/output.booking.dto';

@ApiTags('booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiOkResponse({
    status: 201,
    type: OutputBookingDto,
  })
  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookingService.create(dto);
  }

  @ApiOkResponse({
    status: 200,
    type: [OutputBookingDto],
  })
  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @ApiOkResponse({
    status: 200,
    type: OutputBookingDto,
  })
  @Get('jmeter')
  testingRoute() {
    return this.bookingService.testingJMeter();
  }
}
