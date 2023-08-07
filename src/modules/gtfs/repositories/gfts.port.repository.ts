import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import GtfsPortModel from '../shemas/gtfs.port.model';
import { CreateGtfsPortDto } from '../dto/create.gtfs.port.dto';

@Injectable()
export default class GftsPortRepository {
  constructor(
    @InjectModel(GtfsPortModel)
    private readonly portSchema: typeof GtfsPortModel,
  ) {}

  async create(body: CreateGtfsPortDto): Promise<GtfsPortModel> {
    return this.portSchema.create(body);
  }

  async findById(id: string): Promise<GtfsPortModel> {
    return this.portSchema.findByPk(id);
  }
}
