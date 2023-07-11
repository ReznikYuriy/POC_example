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

  async cleanLocations() {
    await this.locationSchema.destroy({
      where: {},
      truncate: true,
    });
  }

  /* async findOneById(id: number): Promise<ShippingEstimateInterface> {
    return await this.shippingEstimateSchema.findOne({ where: { id } });
  }

  async findUserByEstimateId(estimate_id: number) {
    const user = await this.shippingEstimateSchema.findOne({
      where: { id: estimate_id },
      attributes: ['id'],
      include: [
        {
          model: ShippingRequest,
          attributes: ['id'],
          include: [
            {
              model: User,
              attributes: ['id', 'email'],
            },
          ],
        },
      ],
    });
    return user;
  }

  async findByRequestId(id: string): Promise<ShippingEstimate> {
    return this.shippingEstimateSchema.findOne({ where: { shipping_id: id } });
  } */
}
