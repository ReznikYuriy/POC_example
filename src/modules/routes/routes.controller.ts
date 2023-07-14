import { Controller, Get, Query } from '@nestjs/common';
import { RouteService } from './services/route.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OutputLocationDto } from './dto/output.location.dto';
import { OutputRouteDto } from './dto/output.route.dto';
import { TripService } from './services/trip.service';
import { TripsQueryDto } from './dto/query.trip.dto';

@ApiTags('routes')
@Controller('routes')
export class RoutesController {
  constructor(
    private readonly routesService: RouteService,
    private readonly tripService: TripService,
  ) {}

  @ApiOkResponse({
    status: 201,
    type: [OutputLocationDto],
  })
  @Get('locations')
  async findAllLocations() {
    return this.routesService.findAllLocations();
  }

  @ApiOkResponse({
    status: 201,
    type: [OutputRouteDto],
  })
  @Get('routes')
  async findAllRoutes() {
    return this.routesService.findAllRoutes();
  }

  @ApiOkResponse({
    status: 201,
    //type: [OutputRouteDto],
  })
  @Get('trips')
  async findTrips(@Query() query: TripsQueryDto) {
    return this.tripService.searchTrips(query);
  }
}
