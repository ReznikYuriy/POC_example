import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoutesService } from './services/routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import LocationModel from './shemas/location.model';
import { CreateLocationDto } from './dto/create.location.dto';

@ApiTags('routes')
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @ApiOkResponse({
    status: 201,
    type: [CreateLocationDto],
  })
  @Get('locations')
  async findAllLocations() {
    return this.routesService.findAllLocations();
  }
}
