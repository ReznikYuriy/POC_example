import { Module } from '@nestjs/common';
import { BookingService } from './services/booking.service';
import { BookingController } from './booking.controller';
import BookingRepository from './repositories/booking.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import BookingModel from './shemas/booking.model';
import { RoutesModule } from '../routes/routes.module';

@Module({
  imports: [SequelizeModule.forFeature([BookingModel]), RoutesModule],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
  exports: [BookingService],
})
export class BookingModule {}
