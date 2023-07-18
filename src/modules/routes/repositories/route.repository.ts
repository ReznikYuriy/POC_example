import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import RouteModel from '../shemas/route.model';
import { CreateRouteDto } from '../dto/create.route.dto';
import LocationModel from '../shemas/location.model';
import { Op } from 'sequelize';

@Injectable()
export default class RouteRepository {
  constructor(
    @InjectModel(RouteModel)
    private readonly routeSchema: typeof RouteModel,
  ) {}

  async create(dto: CreateRouteDto): Promise<RouteModel> {
    return this.routeSchema.create(dto);
  }

  async findAll(): Promise<RouteModel[]> {
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
  }
}
