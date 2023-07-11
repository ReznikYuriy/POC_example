import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { HttpMethods } from '../enum/api.http.methods.enum';
import configs from 'src/configs';

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);
  constructor(private readonly httpService: HttpService) {}

  async request(path: string, method: HttpMethods, query: string, body: any) {
    const { ...dataBody } = body;
    const requestBody = {
      url: `${configs.liknoss.url}${path}${query}`,
      method,
      data: dataBody || {},
      headers: {
        ['agency-code']: configs.liknoss.agency_code,
        ['agency-user-name']: configs.liknoss.agency_user_name,
        ['agency-password']: configs.liknoss.agency_password,
        ['agency-signature']: configs.liknoss.agency_signature,
        ['language-code']: configs.liknoss.language_code,
      },
    };
    this.logger.log('requestBody.url: ', requestBody.url);
    try {
      const { data } = await this.httpService.axiosRef.request(requestBody);
      return data;
    } catch (error) {
      this.logger.error(error.response.data);
      throw 'An AXIOS error happened!';
    }
  }
}
