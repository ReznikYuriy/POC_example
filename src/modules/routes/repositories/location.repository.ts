import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateLocationDto } from '../dto/create.location.dto';
import LocationModel from '../shemas/location.model';

@Injectable()
export default class LocationRepository {
  constructor(
    @InjectModel(LocationModel)
    private readonly locationSchema: typeof LocationModel,
  ) {}

  async create(dto: CreateLocationDto): Promise<LocationModel> {
    return this.locationSchema.create(dto);
  }

  async findAll(): Promise<LocationModel[]> {
    return this.locationSchema.findAll({ attributes: ['id', 'name'] });
  }

  async findAllByParams(where): Promise<LocationModel[]> {
    return this.locationSchema.findAll(where);
  }

  async cleanLocations() {
    await this.locationSchema.destroy({
      where: {},
      truncate: true,
    });
  }
}
