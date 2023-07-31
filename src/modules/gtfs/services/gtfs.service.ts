import { Injectable } from '@nestjs/common';
import * as csv from 'csvtojson';
import GftsRouteRepository from '../repositories/gfts.route.repository';
import { CreateGtfsRouteDto } from '../dto/create.gtfs.route.dto';
import GftsAgencyRepository from '../repositories/gfts.agency.repository';
import { CreateGtfsAgencyDto } from '../dto/create.gtfs.agency.dto';
import TripModel from 'src/modules/routes/shemas/trip.model';
import GtfsRouteModel from '../shemas/gtds.route.model';

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

  async validationGtfsTrip(trips: TripModel[]): Promise<boolean> {
    const getTimeToString = (_date: Date): string => {
      const date = new Date(_date);
      //console.log({ date });
      //console.log(typeof date);
      const hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      const mm =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      const ss =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return `${hh}:${mm}:${ss}`;
    };
    for (let i = 0; i < trips.length; i++) {
      const trip = trips[i]; /* .get({ plain: true }) */
      console.log(trip.company_id);
      console.log(trip.loc_orig.name);
      console.log(trip.loc_dest.name);
      console.log(getTimeToString(trip.date_start));
      console.log(getTimeToString(trip.date_end));
      const gtfsTrip = await this.gftsRouteRepository.findByParams(
        trip.company_id,
        trip.loc_orig.name,
        trip.loc_dest.name,
        getTimeToString(trip.date_start),
        getTimeToString(trip.date_end),
      );
      console.log({ gtfsTrip });
      if (!gtfsTrip) {
        return false;
      }
    }
    return true;
  }

  async getGtfsRecordsForSwagger(
    //company_id: string,
    loc_orig_name: string,
    loc_dest_name: string,
  ): Promise<GtfsRouteModel[]> {
    const gtfsRecords = await this.gftsRouteRepository.findAllByParams(
      //company_id,
      loc_orig_name,
      loc_dest_name,
    );
    return gtfsRecords;
  }
}
