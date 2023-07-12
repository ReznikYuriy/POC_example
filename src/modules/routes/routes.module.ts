import { Module } from '@nestjs/common';
import { RoutesService } from './services/routes.service';
import { RoutesController } from './routes.controller';
import { FillDBController } from './fill_db.controller';
import { LiknossModule } from '../liknoss/liknoss.module';
import LocationRepository from './repositories/location.repository';
import LocationModel from './shemas/location.model';
import { SequelizeModule } from '@nestjs/sequelize';
import RouteModel from './shemas/route.model';
import RouteRepository from './repositories/route.repository';

@Module({
  imports: [
    LiknossModule,
    SequelizeModule.forFeature([LocationModel, RouteModel]),
  ],
  controllers: [RoutesController, FillDBController],
  providers: [RoutesService, LocationRepository, RouteRepository],
})
export class RoutesModule {}
