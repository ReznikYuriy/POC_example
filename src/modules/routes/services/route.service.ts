import { Injectable } from '@nestjs/common';
import { LiknossService } from 'src/modules/liknoss/services/liknoss.service';
import LocationRepository from '../repositories/location.repository';
import LocationModel from '../shemas/location.model';
import RouteModel from '../shemas/route.model';
import RouteRepository from '../repositories/route.repository';

@Injectable()
export class RouteService {
  constructor(
    private readonly liknossService: LiknossService,
    private readonly locationsRepository: LocationRepository,
    private readonly routeRepository: RouteRepository,
  ) {}

  async findAllLocations(): Promise<LocationModel[]> {
    return this.locationsRepository.findAll();
  }

  async fillDbLocations() {
    const locations: [any] = await this.liknossService.findAllLocations();
    await this.locationsRepository.cleanLocations();
    for (let i = 0; i < locations.length; i++) {
      await this.locationsRepository.create({
        id: locations[i].idOrCode,
        name: locations[i].name,
        country: locations[i].country.name,
      });
    }
    return this.locationsRepository.findAll();
  }

  async findAllRoutes(): Promise<RouteModel[]> {
    return this.routeRepository.findAll();
  }

  async fillDbRoutes() {
    const routes: [any] = await this.liknossService.findAllRoutes();
    await this.routeRepository.cleanRoutes();
    for (let i = 0; i < routes.length; i++) {
      await this.routeRepository.create({
        loc_origin: routes[i].origin.idOrCode,
        loc_destination: routes[i].destination.idOrCode,
        description: routes[i].description,
      });
    }
    return this.routeRepository.findAll();
  }
}
