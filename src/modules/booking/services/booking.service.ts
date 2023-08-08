import { Injectable, Logger } from '@nestjs/common';
import { CreateBookingDto } from '../dto/create.booking.dto';
import BookingRepository from '../repositories/booking.repository';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private readonly bookingRepository: BookingRepository) {}

  async create(dto: CreateBookingDto) {
    const fibon = this.fib(43);
    return this.bookingRepository.create(dto);
  }

  async findAll() {
    return this.bookingRepository.findAll();
  }

  private fib(n) {
    return n <= 1 ? n : this.fib(n - 1) + this.fib(n - 2);
  }
}
