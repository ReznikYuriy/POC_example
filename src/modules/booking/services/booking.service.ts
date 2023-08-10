import { Injectable, Logger } from '@nestjs/common';
import { CreateBookingDto } from '../dto/create.booking.dto';
import BookingRepository from '../repositories/booking.repository';
import { TripService } from 'src/modules/routes/services/trip.service';
import { PricingTripDto } from 'src/modules/routes/dto/pricing.trip.dto';
import { SexType } from 'src/modules/routes/enum/sex.type.enum';
import { PriceAccommodationType } from '../enum/price.accommodation.type.enum';

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

    const currentTrip = tripsReq.trips[0];
    console.log('trip.accommodations', currentTrip.accommodations);
    if (
      !currentTrip.accommodations ||
      currentTrip.accommodations.length === 0 ||
      !currentTrip.vessel_id
    )
      return false;
    const percentBookingForTesting = 20; //for testing %
    const randomNumber = Math.floor(Math.random() * (100 - 1)) + 1; //for testing
    if (randomNumber > percentBookingForTesting) return true;
    const pass_accom = currentTrip.accommodations.find(
      (el) =>
        el.type === PriceAccommodationType.PASSENGER &&
        el.accommodation_id !== 'INF0',
    );
    console.log({ pass_accom });
    const veh_accom = currentTrip.accommodations.find(
      (el) => el.type === PriceAccommodationType.VEHICLE,
    );
    console.log({ veh_accom });
    const pricingBody: PricingTripDto = {
      departure_date_time: this.convertDateToString(currentTrip.date_start),
      loc_origin_code: currentTrip.loc_origin,
      loc_destination_code: currentTrip.loc_destination,
      vessel_id: currentTrip.vessel_id,
      company_code: currentTrip.company_id,
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
            },
          ]
        : [],
    };
    console.log({ pricingBody });
    console.log(pricingBody.passengers);
    console.log(currentTrip.date_start);
    const currentPricing = await this.tripService.getPricing(pricingBody);
    console.log(
      `currentPricing['fareIdOrCode']: `,
      currentPricing['fareIdOrCode'],
    );
    if (!currentPricing.hasOwnProperty('fareIdOrCode')) return currentPricing;
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
    console.log({ bookingBody });
    return this.create(bookingBody);
  }
  private convertDateToString(date: Date) {
    const _date = new Date(date);
    const year = _date.getFullYear();
    const month =
      _date.getMonth() + 1 < 10
        ? '0' + (_date.getMonth() + 1)
        : _date.getMonth() + 1;
    const day = _date.getDate() < 10 ? '0' + _date.getDate() : _date.getDate();
    const hours =
      _date.getUTCHours() + 2 < 10
        ? '0' + (_date.getUTCHours() + 2)
        : _date.getUTCHours() + 2;
    const minutes =
      _date.getMinutes() < 10 ? '0' + _date.getMinutes() : _date.getMinutes();
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  /* async testingJMeter(): Promise<any> {
    const tripsReq = await this.tripService.searchTrips({
      location_origin: 'PIR',
      location_destination: 'HER',
      date: '2023-09-15',
      passengers: 1,
      vehicles: 1,
      isRandom: true,
    });
    if (!tripsReq.trips || tripsReq.trips.length === 0) return false;

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
            },
          ]
        : [],
    };
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
  } */
}
