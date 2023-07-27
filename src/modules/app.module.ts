import { Module } from '@nestjs/common';
import configs from 'src/configs';
import { SequelizeModule } from '@nestjs/sequelize';
import { CacheModule } from '@nestjs/cache-manager';
import { RoutesModule } from './routes/routes.module';
import { LiknossModule } from './liknoss/liknoss.module';
import LocationModel from './routes/shemas/location.model';
import RouteModel from './routes/shemas/route.model';
import TripModel from './routes/shemas/trip.model';
import * as redisStore from 'cache-manager-redis-store';
import { BullModule } from '@nestjs/bull';
import { GtfsModule } from './gtfs/gtfs.module';
import GtfsRouteModel from './gtfs/shemas/gtds.route.model';
import GtfsAgencyModel from './gtfs/shemas/gtds.agency.model ';

@Module({
  imports: [
    SequelizeModule.forRoot({
      ...configs.postgres,
      dialect: 'postgres',
      autoLoadModels: true,
      synchronize: true,
      models: [
        LocationModel,
        RouteModel,
        TripModel,
        GtfsRouteModel,
        GtfsAgencyModel,
      ],
    }),
    CacheModule.register({
      isGlobal: true,
      host: configs.redis.host,
      port: configs.redis.port,
      ttl: configs.redis.ttl,
      store: redisStore as any,
    }),
    BullModule.forRoot({
      redis: {
        host: configs.redis.host,
        port: Number(configs.redis.port),
      },
    }),
    RoutesModule,
    LiknossModule,
    GtfsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
