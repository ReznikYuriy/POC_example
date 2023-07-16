import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import RouteModel from '../shemas/route.model';
import { CreateRouteDto } from '../dto/create.route.dto';

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
    });
  }

  async cleanRoutes() {
    await this.routeSchema.destroy({
      where: {},
      truncate: true,
    });
  }
}
