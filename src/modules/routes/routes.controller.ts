import { Controller, Get } from '@nestjs/common';
import { RoutesService } from './services/routes.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OutputLocationDto } from './dto/output.location.dto';
import { OutputRouteDto } from './dto/output.route.dto';

@ApiTags('routes')
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

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
}
