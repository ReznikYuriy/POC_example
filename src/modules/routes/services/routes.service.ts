import { Injectable } from '@nestjs/common';
import { CreateRouteDto } from '../dto/create-route.dto';
import { UpdateRouteDto } from '../dto/update-route.dto';
import { LiknossService } from 'src/modules/liknoss/services/liknoss.service';
import LocationRepository from '../repositories/location.repository';
import LocationModel from '../shemas/location.model';

@Injectable()
export class RoutesService {
  constructor(
    private readonly liknossService: LiknossService,
    private readonly locationsRepository: LocationRepository,
  ) {}

  create(createRouteDto: CreateRouteDto) {
    return 'This action adds a new route';
  }

  findAll() {
    return `This action returns all routes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} route`;
  }

  update(id: number, updateRouteDto: UpdateRouteDto) {
    return `This action updates a #${id} route`;
  }

  remove(id: number) {
    return `This action removes a #${id} route`;
  }

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
}
