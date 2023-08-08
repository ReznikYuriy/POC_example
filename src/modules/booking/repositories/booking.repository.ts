import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import BookingModel from '../shemas/booking.model';
import { CreateBookingDto } from '../dto/create.booking.dto';

@Injectable()
export default class BookingRepository {
  constructor(
    @InjectModel(BookingModel)
    private readonly bookingSchema: typeof BookingModel,
  ) {}

  async create(dto: CreateBookingDto): Promise<BookingModel> {
    const data = {
      ...dto,
      departure_date_time: new Date(dto.departure_date_time),
      arrival_date_time: new Date(dto.arrival_date_time),
    };
    return this.bookingSchema.create(data);
  }

  async findAll(): Promise<BookingModel[]> {
    return this.bookingSchema.findAll();
  }
}
