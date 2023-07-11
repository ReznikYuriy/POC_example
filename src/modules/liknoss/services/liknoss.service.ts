import { Injectable } from '@nestjs/common';
import { ApiService } from './api.service';
import { HttpMethods } from '../enum/api.http.methods.enum';

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
}
