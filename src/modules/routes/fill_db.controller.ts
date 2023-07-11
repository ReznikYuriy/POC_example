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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('fill_db')
@Controller('fill_db')
export class FillDBController {
  constructor(private readonly routesService: RoutesService) {}

  @Get('locations')
  async fillLocations() {
    return this.routesService.fillDbLocations();
  }
}
