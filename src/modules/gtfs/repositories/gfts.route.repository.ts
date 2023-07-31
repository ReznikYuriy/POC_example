import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import GtfsRouteModel from '../shemas/gtds.route.model';
import { CreateGtfsRouteDto } from '../dto/create.gtfs.route.dto';

@Injectable()
export default class GftsRouteRepository {
  constructor(
    @InjectModel(GtfsRouteModel)
    private readonly routeSchema: typeof GtfsRouteModel,
  ) {}

  async create(body: CreateGtfsRouteDto): Promise<GtfsRouteModel> {
    return this.routeSchema.create(body);
  }

  async findByParams(
    agency_id: string,
    loc_origin: string,
    loc_destination: string,
    dep_time: string,
    arr_time: string,
  ): Promise<GtfsRouteModel> {
    return this.routeSchema.findOne({
      where: {
        agency: { [Op.iLike]: agency_id },
        loc_origin_name: { [Op.iLike]: loc_origin },
        loc_destination_name: { [Op.iLike]: loc_destination },
        departure_time: dep_time,
        arrival_time: arr_time,
      },
    });
  }
  async findAllByParams(
    //agency_id: string,
    loc_origin: string,
    loc_destination: string,
  ): Promise<GtfsRouteModel[]> {
    return this.routeSchema.findAll({
      where: {
        //agency: { [Op.iLike]: agency_id },
        loc_origin_name: { [Op.iLike]: loc_origin },
        loc_destination_name: { [Op.iLike]: loc_destination },
      },
    });
  }
}
