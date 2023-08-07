import { Module } from '@nestjs/common';
import { GtfsService } from './services/gtfs.service';
import { GtfsController } from './gtfs.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import GtfsRouteModel from './shemas/gtfs.route.model';
import GftsRouteRepository from './repositories/gfts.route.repository';
import GtfsAgencyModel from './shemas/gtfs.agency.model ';
import GftsAgencyRepository from './repositories/gfts.agency.repository';
import GftsPortRepository from './repositories/gfts.port.repository';
import GtfsPortModel from './shemas/gtfs.port.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      GtfsRouteModel,
      GtfsAgencyModel,
      GtfsPortModel,
    ]),
  ],
  controllers: [GtfsController],
  providers: [
    GtfsService,
    GftsRouteRepository,
    GftsAgencyRepository,
    GftsPortRepository,
  ],
  exports: [GtfsService],
})
export class GtfsModule {}
