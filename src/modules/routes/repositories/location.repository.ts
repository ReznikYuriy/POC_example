import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateLocationDto } from '../dto/create.location.dto';
import LocationModel from '../shemas/location.model';
import { Op } from 'sequelize';

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
    return this.locationSchema.findAll({
      where: { country: { [Op.iLike]: 'Greece' } },
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });
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

  async findOneById(id: string): Promise<LocationModel> {
    return this.locationSchema.findOne({
      where: { id },
    });
  }
}
