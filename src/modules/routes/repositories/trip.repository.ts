import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import TripModel from '../shemas/trip.model';
import { Op } from 'sequelize';
import { CreateTripDto } from '../dto/create.trip.dto';
import { UpdateTripDto } from '../dto/update.trip.dto';
import LocationModel from '../shemas/location.model';

@Injectable()
export default class TripRepository {
  constructor(
    @InjectModel(TripModel)
    private readonly tripSchema: typeof TripModel,
  ) {}

  async create(dto: CreateTripDto): Promise<TripModel> {
    return this.tripSchema.create(dto);
  }

  async findAll(
    loc_origin: string,
    loc_destination: string,
    date_start: string,
  ): Promise<TripModel[]> {
    return this.tripSchema.findAll({
      where: {
        loc_origin,
        loc_destination,
        date_start: {
          [Op.between]: [
            new Date(date_start),
            new Date(new Date(date_start).setUTCHours(23, 59, 59, 999)),
          ],
        },
      },
      include: [
        { model: LocationModel, as: 'loc_orig', attributes: ['name'] },
        { model: LocationModel, as: 'loc_dest', attributes: ['name'] },
      ],
    });
  }

  async findOne(dto: CreateTripDto): Promise<TripModel> {
    const { loc_origin, loc_destination, company, date_start } = dto;
    return this.tripSchema.findOne({
      where: {
        loc_origin,
        loc_destination,
        company,
        //date_start,
        date_start: {
          [Op.between]: [
            new Date(date_start),
            new Date(new Date(date_start).setUTCHours(23, 59, 59, 999)),
          ],
        },
      },
    });
  }

  async findById(id: number): Promise<TripModel> {
    return this.tripSchema.findByPk(id);
  }

  async update(id: number, data: UpdateTripDto): Promise<TripModel> {
    if (Object.keys(data).length === 0) return this.findById(id);
    const [, [updReq]] = await this.tripSchema.update(
      { ...data },
      { where: { id }, returning: true },
    );
    //return this.findById(id);
    return updReq;
  }

  async findAllByParams(where): Promise<TripModel[]> {
    return this.tripSchema.findAll(where);
  }
}
