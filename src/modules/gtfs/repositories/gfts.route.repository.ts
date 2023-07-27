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

  /* async findAll(): Promise<RouteModel[]> {
    return this.routeSchema.findAll({
      attributes: ['id', 'loc_origin', 'loc_destination', 'description'],
      order: [['description', 'ASC']],
      include: [
        {
          model: LocationModel,
          as: 'loc_orig',
          attributes: ['name', 'country'],
          where: { country: { [Op.iLike]: 'Greece' } },
        },
        {
          model: LocationModel,
          as: 'loc_dest',
          attributes: ['name', 'country'],
          where: { country: { [Op.iLike]: 'Greece' } },
        },
      ],
    });
  }

  async cleanRoutes() {
    await this.routeSchema.destroy({
      where: {},
      truncate: true,
    });
  } */
}
