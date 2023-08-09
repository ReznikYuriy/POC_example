import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
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
import { Op } from 'sequelize';
import RouteModel from '../shemas/route.model';
import { TripCompanyQueryDto } from '../dto/query.trip.company.dto';
import { GtfsService } from 'src/modules/gtfs/services/gtfs.service';
import { PricingTripDto } from '../dto/pricing.trip.dto';

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
    private readonly gtfsService: GtfsService,
  ) {}

  async searchTrips(query: TripsQueryDto): Promise<{
    trips: TripModel[];
    from: string;
    GFTS_status: boolean;
    GTFS_records: any[];
  }> {
    let isUseGtfsForTesting = true;
    const randomNumber = Math.floor(Math.random() * (100 - 1)) + 1; //for testing
    console.log({ randomNumber });
    const dto = {
      ...query,
      passengers: query.passengers || 1,
      vehicles: query.vehicles || 0,
      isRandom: query.isRandom || false,
    };
    console.log({ dto });
    if (
      (typeof dto.isRandom === 'boolean' && dto.isRandom === true) ||
      (typeof dto.isRandom === 'string' && dto.isRandom === 'true')
    ) {
      const percentLiknossForTesting = 1; //for testing
      const randomNumber = Math.floor(Math.random() * (100 - 1)) + 1; //for testing
      isUseGtfsForTesting =
        randomNumber <= percentLiknossForTesting ? true : false;

      /* const randomIntFromInterval = (min: number, max: number) => {
        const num = Math.floor(Math.random() * (max - min + 1) + min);
        if (num < 10) {
          return '0' + num;
        }
        return num;
      };
      const locations = (
        await this.routeService.findAllLocByParams({
          where: { country: { [Op.iLike]: 'Greece' } },
          attributes: ['id'],
        })
      ).map((loc) => loc.get({ plain: true }).id);
      const routes = (await this.routeService.findAllRoutes())
        .map((route) => route.get({ plain: true }))
        .filter(
          (route) =>
            locations.includes(route.loc_origin) &&
            locations.includes(route.loc_destination),
        );
      const currRoute =
        routes[Math.floor(Math.random() * 30)];
      dto.location_origin = currRoute.loc_origin;
      dto.location_destination = currRoute.loc_destination;
      dto.date = `2023-${randomIntFromInterval(10, 12)}-${randomIntFromInterval(
        1,
        30,
      )}`; */
      const routes = await this.routeService.findAllRoutes();
      const favoriteRoutesIds = [
        1148, 409, 1057, 16, 487, 164, 685, 396, 884, 79,
      ].sort();
      const favoriteRoutesLoc = [
        { location_origin: 'JMK', location_destination: 'JTR' }, //Mykonos-Santorini (Thira)
        { location_origin: 'JNX', location_destination: 'JTR' }, //Naxos-Santorini (Thira)
        { location_origin: 'PAS', location_destination: 'JMK' }, //Paros-Mykonos
        { location_origin: 'JTR', location_destination: 'JSH' }, //Santorini (Thira)-Crete (Sitia)
        { location_origin: 'JTR', location_destination: 'PAS' }, //Santorini (Thira)-Paros
        { location_origin: 'SIF', location_destination: 'MLO' }, //Sifnos-Milos
        { location_origin: 'IOS', location_destination: 'JMK' }, //Ios-Mykonos
        { location_origin: 'IOS', location_destination: 'JTR' }, //Ios-Santorini (Thira)
        { location_origin: 'MLO', location_destination: 'JNX' }, //Milos-Naxos
      ];
      const favoriteDates = [
        '2023-07-20',
        '2023-08-01',
        '2023-08-15',
        '2023-09-01',
        '2023-09-15',
        '2023-10-01',
        '2023-10-15',
        '2023-11-01',
        '2023-11-15',
        '2023-12-01',
      ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      /* const favoriteRoutes = routes.filter((r) =>
        favoriteRoutesIds.includes(r.id),
      ); */
      const favoriteRoutes = [];
      for (let i = 0; i < favoriteRoutesLoc.length; i++) {
        const route = routes.find(
          (el) =>
            el.loc_origin === favoriteRoutesLoc[i].location_origin &&
            el.loc_destination === favoriteRoutesLoc[i].location_destination,
        );
        if (route) {
          favoriteRoutes.push(route);
        }
      }
      const randIndexRoute = Math.floor(Math.random() * favoriteRoutes.length);
      console.log({ randIndexRoute });
      const randIndexDate = Math.floor(Math.random() * favoriteDates.length);
      console.log({ randIndexDate });
      console.log('favoriteRoutes.length: ', favoriteRoutes.length);
      const currRoute = favoriteRoutes[randIndexRoute];
      console.log({ currRoute });
      dto.location_origin = currRoute.loc_origin;
      dto.location_destination = currRoute.loc_destination;
      dto.date = favoriteDates[randIndexDate];
      console.log({ dto });
    }
    ////////////////////////////////////////////////////////////////////////////////////////
    console.log({ dto });
    console.log({ isUseGtfsForTesting });
    ///////////////
    const dto_loc_orig_name = await this.routeService.findLocById(
      dto.location_origin,
    );

    const dto_loc_dest_name = await this.routeService.findLocById(
      dto.location_destination,
    );
    ///////////////
    const redisKey = `${dto.location_origin}-${dto.location_destination}-${dto.date}`;
    this.logger.log({ redisKey });
    const fromCache = await this.getCache(redisKey);
    //console.log(fromCache.length);
    if (fromCache && fromCache.length !== 0) {
      const gtfs = isUseGtfsForTesting
        ? await this.gtfsService.validationGtfsTrip(fromCache)
        : true;
      //console.log({ gtfs });
      if (gtfs) {
        this.logger.verbose(' Return from Redis!');
        return {
          trips: fromCache,
          from: 'Redis',
          GFTS_status: true,
          GTFS_records: await this.gtfsService.getGtfsRecordsForSwagger(
            dto_loc_orig_name.name,
            dto_loc_dest_name.name,
            dto.location_origin,
            dto.location_destination,
          ),
        };
      } else {
        this.logger.verbose('REDIS BRANCH!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        const tripsFromLiknossAfterUpd =
          await this.getTripsFromLinkossToDbAndCache(dto);
        return {
          ...tripsFromLiknossAfterUpd,
          GFTS_status: false,
          GTFS_records: await this.gtfsService.getGtfsRecordsForSwagger(
            dto_loc_orig_name.name,
            dto_loc_dest_name.name,
            dto.location_origin,
            dto.location_destination,
          ),
        };
      }
    } else {
      this.logger.verbose(' Cache empty!');
      /* await this.liknossQueue.add(
        'get-trips-request',
        { dto },
        {
          removeOnComplete: true,
        },
      ); */
      const fromDb = await this.tripRepository.findAll(
        dto.location_origin,
        dto.location_destination,
        dto.date,
      );

      /////////////////
      const gtfs = isUseGtfsForTesting
        ? await this.gtfsService.validationGtfsTrip(fromDb)
        : true;
      //console.log({ gtfs });
      if (gtfs && fromDb.length > 0) {
        await this.cacheSet(redisKey, fromDb);
        this.logger.verbose(' Return from Postgres!');
        return {
          trips: fromDb,
          from: 'Postgres',
          GFTS_status: true,
          GTFS_records: await this.gtfsService.getGtfsRecordsForSwagger(
            dto_loc_orig_name.name,
            dto_loc_dest_name.name,
            dto.location_origin,
            dto.location_destination,
          ),
        };
      } else {
        this.logger.verbose(
          'POSTGRES BRANCH!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
        );
        const tripsFromLiknossAfterUpd =
          await this.getTripsFromLinkossToDbAndCache(dto);
        return {
          ...tripsFromLiknossAfterUpd,
          GFTS_status: false,
          GTFS_records: await this.gtfsService.getGtfsRecordsForSwagger(
            dto_loc_orig_name.name,
            dto_loc_dest_name.name,
            dto.location_origin,
            dto.location_destination,
          ),
        };
      }
      /////////////////
    }
  }

  async getTripsFromLinkoss(dto: TripsQueryDto) {
    const liknossTrips = await this.getLinkossTripsForRoute(dto);
    for (const tripBody of liknossTrips) {
      await this.liknossQueue.add(
        'read-write-db-trip',
        { tripBody },
        {
          removeOnComplete: true,
        },
      );
    }
    if (liknossTrips?.length > 0) {
      this.cacheSet(
        `${dto.location_origin}-${dto.location_destination}-${dto.date}`,
        liknossTrips,
      );
      this.logger.log('CACHE UPDATED');
    }
  }

  private async getLinkossTripsForRoute(
    dto: TripsQueryDto,
  ): Promise<TripModel[]> {
    const liknossReq = await this.liknossService.findTrips(
      this.prepareLiknossSearchBody(dto),
    );
    const liknossTrips = [];
    const trips: [] = liknossReq['trips'];
    const companies: [] = liknossReq['companies'];
    if (trips) {
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
          company_id: trip['vessel']['company']['abbreviation'],
          company:
            companies[`${trip['vessel']['company']['abbreviation']}`]['name'] ||
            '',
        };
        liknossTrips.push(tripBody);
      }
    }
    return liknossTrips;
  }

  private prepareLiknossSearchBody(query: TripsQueryDto): FindTripLiknossDto {
    return {
      departureDate: query.date,
      originIdOrCode: query.location_origin,
      destinationIdOrCode: query.location_destination,
      sorting: 'BY_DEPARTURE_TIME',
      availabilityInformation: true,
      fetchVehicleAccommodations: true,
      quoteRequest: { passengers: query.passengers, vehicles: query.vehicles },
    };
  }

  async cacheSet(key: string, data: TripModel[]): Promise<void> {
    await this.cacheService.set(key, data);
  }
  async getCache(key: string): Promise<any> {
    return await this.cacheService.get(key);
  }

  /* async fillDbTrips(): Promise<void> {
    const locations = (
      await this.routeService.findAllLocByParams({
        where: { country: { [Op.iLike]: 'Greece' } },
        attributes: ['id'],
      })
    ).map((loc) => loc.get({ plain: true }).id);
    const routes = (await this.routeService.findAllRoutes())
      .map((route) => route.get({ plain: true }))
      .filter(
        (route) =>
          locations.includes(route.loc_origin) &&
          locations.includes(route.loc_destination),
      );
    const favoriteRoutesIds = [
      1148, 409, 1057, 16, 487, 164, 685, 396, 884, 79,
    ].sort();
    const favoriteDates = [
      '2023-07-20',
      '2023-08-01',
      '2023-08-15',
      '2023-09-01',
      '2023-09-15',
      '2023-10-01',
      '2023-10-15',
      '2023-11-01',
      '2023-11-15',
      '2023-12-01',
      '2023-12-31',
    ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const favoriteRoutes = routes.filter((r) =>
      favoriteRoutesIds.includes(r.id),
    );
    for (let i = 0; i < favoriteRoutes.length; i++) {
      let dummyRoutes = [];
      if (i == 0) {
        dummyRoutes = routes.filter(
          (r) => r.id > 0 && r.id < favoriteRoutes[i].id,
        );
      } else if (i === favoriteRoutes.length - 1) {
        dummyRoutes = routes.filter((r) => r.id > favoriteRoutes[i].id);
      } else {
        dummyRoutes = routes.filter(
          (r) => r.id > favoriteRoutes[i - 1].id && r.id < favoriteRoutes[i].id,
        );
      }
      for (let j = 1; j < favoriteDates.length; j++) {
        const tripsForFavoriteRoute = await this.getLinkossTripsForRoute({
          location_origin: favoriteRoutes[i].loc_origin,
          location_destination: favoriteRoutes[i].loc_destination,
          date: favoriteDates[j - 1],
          passengers: 1,
          vehicles: 0,
        });
        await this.generateTripsBodyByDate(
          favoriteRoutes[i],
          new Date(favoriteDates[j - 1]),
          new Date(favoriteDates[j]),
          tripsForFavoriteRoute,
          false,
        );
        for (const dr of dummyRoutes) {
          await this.generateTripsBodyByDate(
            dr,
            new Date(favoriteDates[j - 1]),
            new Date(favoriteDates[j]),
            tripsForFavoriteRoute,
            true,
          );
        }
      }
    }
  } */
  /* private async generateTripsBodyByDate(
    route: RouteModel,
    start_date: Date,
    end_date: Date,
    liknossTrips: TripModel[],
    isFakeTrip: boolean,
  ) {
    let _date = start_date;
    let daysAdd = 0;
    while (_date < end_date) {
      if (!isFakeTrip) {
        for (const trip of liknossTrips) {
          const tripBody = {
            ...trip,
            date_start: new Date(
              new Date(trip.date_start).setDate(
                new Date(trip.date_start).getDate() + daysAdd,
              ),
            ),
            date_end: new Date(
              new Date(trip.date_end).setDate(
                new Date(trip.date_end).getDate() + daysAdd,
              ),
            ),
          };
          await this.liknossQueue.add(
            'read-write-db-trip',
            { tripBody },
            {
              removeOnComplete: true,
            },
          );
        }
      } else {
        for (const trip of liknossTrips) {
          const tripBody = {
            ...trip,
            loc_origin: route.loc_origin,
            loc_destination: route.loc_destination,
            date_start: new Date(
              new Date(trip.date_start).setDate(
                new Date(trip.date_start).getDate() + daysAdd,
              ),
            ),
            date_end: new Date(
              new Date(trip.date_end).setDate(
                new Date(trip.date_end).getDate() + daysAdd,
              ),
            ),
            //company: `[DummyData] ${trip.company}`,
          };
          await this.liknossQueue.add(
            'read-write-db-trip',
            { tripBody },
            {
              removeOnComplete: true,
            },
          );
        }
      }
      daysAdd++;
      _date = new Date(_date.setDate(_date.getDate() + 1));
    }
  } */

  /* async fillDbTrips2024(): Promise<void> {
    const locations = (
      await this.routeService.findAllLocByParams({
        where: { country: { [Op.iLike]: 'Greece' } },
        attributes: ['id'],
      })
    ).map((loc) => loc.get({ plain: true }).id);
    const routes = (await this.routeService.findAllRoutes())
      .map((route) => route.get({ plain: true }))
      .filter(
        (route) =>
          locations.includes(route.loc_origin) &&
          locations.includes(route.loc_destination),
      );
    for (let i = 0; i < routes.length; i++) {
      const trips = await this.tripRepository.findAllByParams({
        where: {
          loc_origin: routes[i].loc_origin,
          loc_destination: routes[i].loc_destination,
        },
      });
      const daysAdd = 180;
      for (const trip of trips) {
        const { id, createdAt, updatedAt, ...tripParticular } = trip.get({
          plain: true,
        });
        const tripBody = {
          ...tripParticular,
          date_start: new Date(
            new Date(tripParticular.date_start).setDate(
              new Date(tripParticular.date_start).getDate() + daysAdd,
            ),
          ),
          date_end: new Date(
            new Date(tripParticular.date_end).setDate(
              new Date(tripParticular.date_end).getDate() + daysAdd,
            ),
          ),
          //company: `[DummyData] ${trip.company}`,
        };
        await this.liknossQueue.add(
          'read-write-db-trip',
          { tripBody },
          {
            removeOnComplete: true,
          },
        );
      }
    }
  } */

  async searchTripWithDetails(query: TripCompanyQueryDto): Promise<any> {
    const { company, ...dto } = {
      ...query,
      passengers: query.passengers || 1,
      vehicles: query.vehicles || 0,
    };
    const { location_origin, location_destination, date } = dto;
    const liknossReq = await this.liknossService.findTrips(
      this.prepareLiknossSearchBody(dto),
    );
    const liknossTrips = [];
    const trips: [] = liknossReq['trips'];
    const companies: [] = liknossReq['companies'];
    if (trips) {
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
          company_id: trip['vessel']['company']['abbreviation'],
        };
        liknossTrips.push(tripBody);
      }
    }

    await this.liknossQueue.add(
      'read-write-db-trips-cache',
      { location_origin, location_destination, date, liknossTrips },
      {
        removeOnComplete: true,
      },
    );
    console.log(liknossTrips);
    console.log(company);
    //liknossTrips.map((tr) => console.log(tr));
    const tripToOrder = liknossTrips.find((tr) => tr.company_id === company);
    console.log({ tripToOrder });
    if (!tripToOrder) {
      throw new ConflictException('Trip for these parameters is empty.');
    }
    const tripCompany = companies[tripToOrder.company_id];
    console.log({ tripCompany });
    const liknossTrip = trips.find(
      (tr) =>
        tr['vessel']['company']['abbreviation'] === tripToOrder.company_id,
    );
    //////////////////
    const tripAccommodations: any[] = (
      liknossTrip['accommodationAvailabilities'] as []
    )
      .map((ac) => {
        return {
          accommodation_id: ac['accommodation']['idOrCode'],
          availabilityType: ac['availabilityType'],
          adultBasePrice: +ac['adultBasePrice'],
          wholeBerthAvailability: +ac['wholeBerthAvailability'],
          maleBerthAvailability: +ac['maleBerthAvailability'],
          femaleBerthAvailability: +ac['femaleBerthAvailability'],
        };
      })
      .map((acc) => {
        if (
          (
            tripCompany['accommodations']['passengers'] as 'object'
          ).hasOwnProperty(`${acc['accommodation_id']}`)
        ) {
          return {
            ...acc,
            type: 'passengers',
            name: tripCompany['accommodations']['passengers'][
              `${acc['accommodation_id']}`
            ]['name'],
          };
        } else if (
          (
            tripCompany['accommodations']['vehicles'] as 'object'
          ).hasOwnProperty(`${acc['accommodation_id']}`)
        ) {
          return {
            ...acc,
            type: 'vehicles',
            name: tripCompany['accommodations']['vehicles'][
              `${acc['accommodation_id']}`
            ]['name'],
          };
        }
      });

    ////////////////////
    return {
      trip: {
        ...tripToOrder,
        accommodations: tripAccommodations,
        basicPriceAnalysis: liknossTrip['basicPriceAnalysis'],
        discountPriceAnalysis: liknossTrip['discountPriceAnalysis'],
      },
      liknoss_trip: liknossTrip,
      company: tripCompany,
    };
  }

  async fillCompanyId() {
    const companies: [any] = await this.liknossService.findAllCompanies();

    console.log({ companies });
    const trips = await this.tripRepository.findAllByParams({
      where: { company_id: null },
    });
    for (let i = 0; i < trips.length; i++) {
      const company = companies.find(
        (c) =>
          (c['description'] as 'string').toLowerCase() ===
          trips[i].company.toLowerCase(),
      );
      await this.tripRepository.update(trips[i].id, {
        company_id: company['abbreviation'],
      });
    }
    console.log('Update Complete!');
  }

  async getTripsFromLinkossToDbAndCache(dto: TripsQueryDto) {
    const liknossTrips = await this.getLinkossTripsForRoute(dto);

    try {
      //clean trips in db
      await this.tripRepository.delAllByParams({
        where: {
          loc_origin: dto.location_origin,
          loc_destination: dto.location_destination,
          date_start: {
            [Op.between]: [
              new Date(dto.date).setUTCHours(0, 0, 0, 0),
              new Date(new Date(dto.date).setUTCHours(23, 59, 59, 999)),
            ],
          },
        },
      });
      const allPromises = [];
      for (let i = 0; i < liknossTrips.length; i++) {
        allPromises.push(this.tripRepository.create(liknossTrips[i]));
      }
      const outcomes = await Promise.allSettled(allPromises);
      const tripsForRedis = (
        await this.tripRepository.findAll(
          dto.location_origin,
          dto.location_destination,
          dto.date,
        )
      ).map((el) => {
        return el.get({ plain: true });
      });
      if (tripsForRedis?.length > 0) {
        this.cacheSet(
          `${dto.location_origin}-${dto.location_destination}-${dto.date}`,
          tripsForRedis,
        );
        this.logger.log('CACHE UPDATED');
      }
      return { trips: tripsForRedis, from: 'Liknoss' };
      //db check end
    } catch (error) {
      this.logger.error('Bad DB request.', error.stack);
    }
  }

  async getPricing(dto: PricingTripDto): Promise<any> {
    const accommodationArray = [];
    const acc_pass_ids = new Set();
    for (const el of dto.passengers) {
      acc_pass_ids.add(el.accommodation_id);
    }
    for (const id of acc_pass_ids) {
      const accommodationAnalysises = dto.passengers
        .filter((el) => el.accommodation_id === id)
        .map((acc) => ({
          index: 1,
          passengerData: {
            surname: 'TEST',
            name: 'TEST',
            nationality: 'GR',
            birthDate: '1974-05-18',
            documentNumber: '123456',
            type: 'AD',
            sexType: acc.sex,
          },
        }));
      const elem = {
        idOrCode: id,
        accommodationRequestType: 'COMPLETE',
        quantity: 1,
        bedType: 'NO_PREFERENCE',
        accommodationRequestAnalysises: [...accommodationAnalysises],
      };
      accommodationArray.push(elem);
    }
    const acc_veh_ids = new Set();
    for (const el of dto.vehicles) {
      acc_veh_ids.add(el.accommodation_id);
    }
    for (const id of acc_veh_ids) {
      const accommodationAnalysises = dto.vehicles
        .filter((el) => el['accommodation_id'] === id)
        .map((acc) => ({
          index: 1,
          vehicleData: {
            length: acc.length || 0,
            plateNumber: 'YNB2821',
            nationality: 'GR',
            registrationNumber: 'SSSS',
          },
        }));
      const elem = {
        idOrCode: id,
        accommodationRequestType: 'VEHICLE',
        quantity: 1,
        accommodationRequestAnalysises: [...accommodationAnalysises],
      };
      accommodationArray.push(elem);
    }
    const reqBody = {
      leader: {
        firstName: 'TEST BOOKING ONE CLICK',
        lastName: 'TEST BOOKING ONE CLICK',
        mobile: '+917609876289',
        email: 'testbookingoneclick@yopmail.com',
        address: {
          line: '',
          zipCode: '',
          city: '',
          country: '',
        },
      },
      trips: [
        {
          departureDateTime: dto.departure_date_time,
          origin: {
            idOrCode: dto.loc_origin_code,
          },
          destination: {
            idOrCode: dto.loc_destination_code,
          },
          vessel: {
            idOrCode: dto.vessel_id,
            company: {
              abbreviation: dto.company_code,
            },
          },
          accommodationRequests: [...accommodationArray],
        },
      ],
    };
    const liknossReq = await this.liknossService.getPricing(reqBody);
    return liknossReq;
  }
}
