import { Controller, Get } from '@nestjs/common';
import { RoutesService } from './services/routes.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('fill_db')
@Controller('fill_db')
export class FillDBController {
  constructor(private readonly routesService: RoutesService) {}

  @Get('locations')
  async fillLocations() {
    return this.routesService.fillDbLocations();
  }

  @Get('routes')
  async fillRoutes() {
    return this.routesService.fillDbRoutes();
  }
}
