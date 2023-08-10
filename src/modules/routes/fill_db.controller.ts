import { Controller, Get } from '@nestjs/common';
import { RouteService } from './services/route.service';
import { ApiTags } from '@nestjs/swagger';
import { TripService } from './services/trip.service';

@ApiTags('fill_db')
@Controller('fill_db')
export class FillDBController {
  constructor(
    private readonly routesService: RouteService,
    private readonly tripService: TripService,
  ) {}

  @Get('locations')
  async fillLocations() {
    return this.routesService.fillDbLocations();
  }

  @Get('routes')
  async fillRoutes() {
    return this.routesService.fillDbRoutes();
  }

  /* @Get('trips')
  async fillTrips() {
    return this.tripService.fillDbTrips();
  } */

  /* @Get('trips-24')
  async fillTrips2024() {
    return this.tripService.fillDbTrips2024();
  } */

  /* @Get('add_company_id')
  async fillCompanyId() {
    return this.tripService.fillCompanyId();
  } */

  @Get('favorite-trips')
  async fillTrips() {
    return this.tripService.fillDbFavoriteTrips();
  }
}
