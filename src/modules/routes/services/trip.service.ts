import { Inject, Injectable, Logger } from '@nestjs/common';
import { LiknossService } from 'src/modules/liknoss/services/liknoss.service';
import { RouteService } from './route.service';
import TripRepository from '../repositories/trip.repository';
import { TripsQueryDto } from '../dto/query.trip.dto';
import TripModel from '../shemas/trip.model';
import { FindTripLiknossDto } from 'src/modules/liknoss/dto/find.trip.liknoss.dto';
import { CreateTripDto } from '../dto/create.trip.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class TripService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly liknossService: LiknossService,
    private readonly routeService: RouteService,
    private readonly tripRepository: TripRepository,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    @InjectQueue('liknoss-queue')
    private liknossQueue: Queue,
  ) {}

  async searchTrips(query: TripsQueryDto): Promise<TripModel[]> {
    const dto = {
      ...query,
      passengers: query.passengers || 1,
      vehicles: query.vehicles || 0,
    };
    //console.log({ dto });
    const redisKey = `${dto.location_origin}-${dto.location_destination}-${dto.date}`;
    console.log({ redisKey });
    //console.log(redisKey.toString());
    const fromCache = await this.getCache(redisKey);
    if (fromCache) {
      this.logger.verbose(' Return from Redis!');
      return fromCache;
    } else {
      this.logger.verbose(' Cache empty!');
      await this.liknossQueue.add(
        'get-trips-request',
        { dto },
        {
          delay: 1000,
          removeOnComplete: true,
        },
      );
      const fromDb = await this.tripRepository.findAll(
        query.location_origin,
        query.location_destination,
        query.date,
      );
      //await this.cacheSet(redisKey, fromDb);
      return fromDb;
    }
  }

  async getTripsFromLinkoss(dto: TripsQueryDto) {
    //------LIKNOSS
    console.log({ dto });
    const liknossReq = await this.liknossService.findTrips(
      this.prepareLiknossSearchBody(dto),
    );
    const trips: [] = liknossReq['trips'];
    const companies: [] = liknossReq['companies'];
    if (trips) {
      const liknossTrips = [];
      for (let i = 0; i < trips.length; i++) {
        const trip = trips[i];
        const tripBody: CreateTripDto = {
          loc_origin: trip['origin']['idOrCode'],
          loc_destination: trip['destination']['idOrCode'],
          date_start: trip['departureDateTimeWithTimezone'],
          date_end: trip['arrivalDateTimeWithTimezone'],
          duration: Number(trip['duration']),
          price_basic: Number(trip['basicPrice']),
          price_discount: Number(trip['discountPrice']),
          company:
            companies[`${trip['vessel']['company']['abbreviation']}`]['name'] ||
            '',
        };
        liknossTrips.push(tripBody);
        //db check
        const checkTripInDb = await this.tripRepository.findOne(tripBody);
        //console.log({ checkTripInDb });
        if (!checkTripInDb) {
          await this.tripRepository.create(tripBody);
          this.logger.log('CREATE TRIP IN DB');
        } else if (
          checkTripInDb.duration === tripBody.duration &&
          checkTripInDb.price_basic === tripBody.price_basic &&
          checkTripInDb.price_discount === tripBody.price_discount
        ) {
          this.logger.log('TRIP IN DB ACTUAL');
        } else {
          await this.tripRepository.update(checkTripInDb?.id, {
            duration: tripBody.duration,
            price_basic: tripBody.price_basic,
            price_discount: tripBody.price_discount,
            date_end: tripBody.date_end,
          });
          this.logger.log('UPDATE TRIP IN DB');
        }
        //db check end
      }
      if (liknossTrips?.length > 0) {
        this.cacheSet(
          `${dto.location_origin}-${dto.location_destination}-${dto.date}`,
          liknossTrips,
        );
        this.logger.log('CACHE UPDATED');
      }
    }
    //-----------------------------------------
  }

  private prepareLiknossSearchBody(query: TripsQueryDto): FindTripLiknossDto {
    return {
      departureDate: query.date,
      originIdOrCode: query.location_origin,
      destinationIdOrCode: query.location_destination,
      sorting: 'BY_DEPARTURE_TIME',
      availabilityInformation: true,
      quoteRequest: { passengers: query.passengers, vehicles: query.vehicles },
    };
  }

  async cacheSet(key: string, data: TripModel[]): Promise<void> {
    //console.log({ key });
    await this.cacheService.set(key, data);
  }
  async getCache(key: string): Promise<any> {
    return await this.cacheService.get(key);
  }
}
