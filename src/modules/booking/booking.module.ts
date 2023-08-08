import { Module } from '@nestjs/common';
import { BookingService } from './services/booking.service';
import { BookingController } from './booking.controller';
import BookingRepository from './repositories/booking.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import BookingModel from './shemas/booking.model';

@Module({
  imports: [SequelizeModule.forFeature([BookingModel])],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
  exports: [BookingService],
})
export class BookingModule {}
