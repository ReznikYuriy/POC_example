import { Injectable } from '@nestjs/common';
import * as csv from 'csvtojson';
import GftsRouteRepository from '../repositories/gfts.route.repository';
import { CreateGtfsRouteDto } from '../dto/create.gtfs.route.dto';
import GftsAgencyRepository from '../repositories/gfts.agency.repository';
import { CreateGtfsAgencyDto } from '../dto/create.gtfs.agency.dto';

@Injectable()
export class GtfsService {
  constructor(
    private readonly gftsRouteRepository: GftsRouteRepository,
    private readonly gftsAgencyRepository: GftsAgencyRepository,
  ) {}
  async uploadRoutes(file: Express.Multer.File) {
    const csvJson = await csv({
      colParser: {
        ['route_id']: 'number',
        ['agency_id']: 'string',
        ['route_short_name']: 'string',
        ['route_long_name']: 'string',
        ['route_desc']: 'string',
        ['route_type']: 'number',
      },
      checkType: true,
    }).fromString(file.buffer.toString());
    for (let i = 0; i < csvJson.length; i++) {
      const str: string = csvJson[i].route_long_name;
      const intermediary = str
        .slice(str.indexOf('Intermediary Ports') + 'Intermediary Ports:'.length)
        .trim();
      const loc_origin_name = str
        .slice(
          str.indexOf('Origin Port:') + 'Origin Port:'.length,
          str.indexOf('( Departure Time:'),
        )
        .trim();
      const loc_destination_name = str
        .slice(
          str.indexOf('Destination Port:') + 'Destination Port:'.length,
          str.indexOf('( Arrival Time:'),
        )
        .trim();
      const departure_time = str
        .slice(str.indexOf('Departure Time:') + 'Departure Time:'.length)
        .split(')')[0]
        .trim();
      const arrival_time = str
        .slice(str.indexOf('Arrival Time:') + 'Arrival Time:'.length)
        .split(')')[0]
        .trim();
      console.log({ loc_destination_name });
      try {
        const body: CreateGtfsRouteDto = {
          id: csvJson[i].route_id,
          agency: csvJson[i].agency_id,
          intermediary,
          desc: csvJson[i].route_desc,
          route_type: csvJson[i].route_type,
          loc_origin_name,
          //loc_origin_id: 'string',
          loc_destination_name,
          //loc_destination_id: 'string',
          departure_time,
          arrival_time,
        };
        await this.gftsRouteRepository.create(body);
      } catch (err) {
        console.log(err.message);
      }
    }
    return csvJson;
  }

  async uploadAgencies(file: Express.Multer.File) {
    const csvJson = await csv({
      colParser: {
        ['agency_id']: 'string',
        ['agency_name']: 'string',
        ['agency_url']: 'string',
        ['agency_timezone']: 'string',
        ['agency_phone']: 'string',
      },
      checkType: true,
    }).fromString(file.buffer.toString());
    for (let i = 0; i < csvJson.length; i++) {
      try {
        const body: CreateGtfsAgencyDto = {
          id: csvJson[i].agency_id,
          name: csvJson[i].agency_name,
          url: csvJson[i].agency_url,
          timezone: csvJson[i].agency_timezone,
          phone: csvJson[i].agency_phone,
        };
        await this.gftsAgencyRepository.create(body);
      } catch (err) {
        console.log(err.message);
      }
    }
    return csvJson;
  }
}
