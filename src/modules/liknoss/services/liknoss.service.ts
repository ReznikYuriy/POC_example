import { Injectable } from '@nestjs/common';
import { ApiService } from './api.service';
import { HttpMethods } from '../enum/api.http.methods.enum';
import { FindTripLiknossDto } from '../dto/find.trip.liknoss.dto';

@Injectable()
export class LiknossService {
  constructor(private readonly apiClient: ApiService) {}

  async findAllLocations() {
    const result = await this.apiClient.request(
      `locations`,
      HttpMethods.GET,
      '',
      {},
    );
    return result;
  }

  async findAllRoutes() {
    const result = await this.apiClient.request(
      `analytic-routes`,
      HttpMethods.GET,
      '',
      {},
    );
    return result;
  }

  async findTrips(dto: FindTripLiknossDto) {
    const result = await this.apiClient.request(
      `trips`,
      HttpMethods.POST,
      '',
      dto,
    );
    return result;
  }
}
