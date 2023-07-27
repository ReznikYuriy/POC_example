import { Module } from '@nestjs/common';
import { GtfsService } from './services/gtfs.service';
import { GtfsController } from './gtfs.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import GtfsRouteModel from './shemas/gtds.route.model';
import GftsRouteRepository from './repositories/gfts.route.repository';
import GtfsAgencyModel from './shemas/gtds.agency.model ';
import GftsAgencyRepository from './repositories/gfts.agency.repository';

@Module({
  imports: [SequelizeModule.forFeature([GtfsRouteModel, GtfsAgencyModel])],
  controllers: [GtfsController],
  providers: [GtfsService, GftsRouteRepository, GftsAgencyRepository],
  exports: [GtfsService],
})
export class GtfsModule {}
