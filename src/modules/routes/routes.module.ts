import { Module } from '@nestjs/common';
import { RouteService } from './services/route.service';
import { RoutesController } from './routes.controller';
import { FillDBController } from './fill_db.controller';
import { LiknossModule } from '../liknoss/liknoss.module';
import LocationRepository from './repositories/location.repository';
import LocationModel from './shemas/location.model';
import { SequelizeModule } from '@nestjs/sequelize';
import RouteModel from './shemas/route.model';
import RouteRepository from './repositories/route.repository';
import { TripService } from './services/trip.service';
import TripRepository from './repositories/trip.repository';
import TripModel from './shemas/trip.model';
import configs from 'src/configs';
import { BullModule } from '@nestjs/bull';
import { LiknossQueueProcessor } from './services/processor/liknoss.queue.processor';
import { GtfsModule } from '../gtfs/gtfs.module';

@Module({
  imports: [
    LiknossModule,
    GtfsModule,
    SequelizeModule.forFeature([LocationModel, RouteModel, TripModel]),
    BullModule.registerQueueAsync({
      name: 'liknoss-queue',
      useFactory: () => ({
        redis: {
          host: configs.redis.host,
          port: Number(configs.redis.port),
        },
      }),
    }),
  ],
  controllers: [RoutesController, FillDBController],
  providers: [
    RouteService,
    LocationRepository,
    RouteRepository,
    TripService,
    TripRepository,
    LiknossQueueProcessor,
  ],
})
export class RoutesModule {}
