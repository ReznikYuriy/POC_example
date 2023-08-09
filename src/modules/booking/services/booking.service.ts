import { Injectable, Logger } from '@nestjs/common';
import { CreateBookingDto } from '../dto/create.booking.dto';
import BookingRepository from '../repositories/booking.repository';
import { OutputBookingDto } from '../dto/output.booking.dto';
import { RouteService } from 'src/modules/routes/services/route.service';
import { TripService } from 'src/modules/routes/services/trip.service';
import { PricingTripDto } from 'src/modules/routes/dto/pricing.trip.dto';
import { SexType } from 'src/modules/routes/enum/sex.type.enum';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly tripService: TripService,
  ) {}

  async create(dto: CreateBookingDto) {
    const fibon = this.fib(35);
    return this.bookingRepository.create(dto);
  }

  async findAll() {
    return this.bookingRepository.findAll();
  }

  private fib(n) {
    return n <= 1 ? n : this.fib(n - 1) + this.fib(n - 2);
  }

  async testingJMeter(): Promise<any> {
    const tripsReq = await this.tripService.searchTrips({
      location_origin: 'PIR',
      location_destination: 'HER',
      date: '2023-09-15',
      passengers: 1,
      vehicles: 1,
      isRandom: true,
    });
    if (!tripsReq.trips || tripsReq.trips.length === 0) return false;
    /* console.log(
      'DATE: ',
      tripsReq.trips[0].date_start,
      `${tripsReq.trips[0].date_start.getFullYear()}-${
        tripsReq.trips[0].date_start.getMonth() + 1
      }-${tripsReq.trips[0].date_start.getDate()}`,
    ); */
    //console.log('tripsReq.trips[0].date_start', tripsReq.trips[0].date_start);
    //console.log(new Date(tripsReq.trips[0].date_start).getFullYear());
    const currentTrip = await this.tripService.searchTripWithDetails({
      location_origin: tripsReq.trips[0].loc_origin,
      location_destination: tripsReq.trips[0].loc_destination,
      date: `${new Date(tripsReq.trips[0].date_start).getFullYear()}-${
        new Date(tripsReq.trips[0].date_start).getMonth() + 1
      }-${new Date(tripsReq.trips[0].date_start).getDate()}`,
      passengers: 1,
      vehicles: 1,
      company: tripsReq.trips[0].company_id,
    });
    if (!currentTrip) return false;
    const { liknoss_trip } = currentTrip;
    if (!liknoss_trip) return false;
    console.log('trip.accommodations', currentTrip.trip.accommodations);
    if (
      currentTrip.trip.accommodations &&
      currentTrip.trip.accommodations.length === 0
    )
      return false;
    const pass_accom = (currentTrip.trip.accommodations as []).find(
      (el) => el['type'] === 'passengers' && el['accommodation_id'] !== 'INF0',
    );
    console.log({ pass_accom });
    const veh_accom = (currentTrip.trip.accommodations as []).find(
      (el) => el['type'] === 'vehicles',
    );
    console.log({ veh_accom });
    const pricingBody: PricingTripDto = {
      departure_date_time: liknoss_trip.departureDateTime,
      loc_origin_code: liknoss_trip.origin.idOrCode,
      loc_destination_code: liknoss_trip.destination.idOrCode,
      vessel_id: liknoss_trip.vessel.idOrCode,
      company_code: liknoss_trip.vessel.company.abbreviation,
      passengers: [
        {
          accommodation_id: pass_accom['accommodation_id'],
          sex: SexType.MALE,
          adult_fare: 'Adult (age:13 to 99y)',
        },
      ],
      vehicles: veh_accom
        ? [
            {
              accommodation_id: veh_accom['accommodation_id'],
              //"length": 425
            },
          ]
        : [],
    };
    //console.log({ pricingBody });
    const currentPricing = await this.tripService.getPricing(pricingBody);
    if (!currentPricing) return false;
    const bookingBody: CreateBookingDto = {
      loc_origin_code: currentPricing?.trips[0]?.origin?.idOrCode,
      loc_destination_code: currentPricing?.trips[0]?.destination?.idOrCode,
      departure_date_time: currentPricing?.trips[0]?.departureDateTime,
      arrival_date_time: null,
      vessel_id: currentPricing?.trips[0]?.vessel?.idOrCode,
      company_code: currentPricing?.trips[0]?.vessel?.company?.abbreviation,
      prices: currentPricing?.trips[0]?.prices,
      bookingIdentifier: currentPricing?.bookingIdentifier,
    };

    return this.create(bookingBody);
  }
}
