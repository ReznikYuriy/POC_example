import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import GtfsAgencyModel from '../shemas/gtfs.agency.model ';
import { CreateGtfsAgencyDto } from '../dto/create.gtfs.agency.dto';

@Injectable()
export default class GftsAgencyRepository {
  constructor(
    @InjectModel(GtfsAgencyModel)
    private readonly agencySchema: typeof GtfsAgencyModel,
  ) {}

  async create(body: CreateGtfsAgencyDto): Promise<GtfsAgencyModel> {
    return this.agencySchema.create(body);
  }
}
