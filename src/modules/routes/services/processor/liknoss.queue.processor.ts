import {
  InjectQueue,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { TripsQueryDto } from '../../dto/query.trip.dto';
import { TripService } from '../trip.service';
import { CreateTripDto } from '../../dto/create.trip.dto';
import TripRepository from '../../repositories/trip.repository';

@Injectable()
@Processor('liknoss-queue')
export class LiknossQueueProcessor {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly tripService: TripService,
    private readonly tripRepository: TripRepository,
    @InjectQueue('liknoss-queue')
    private queue: Queue,
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}.`);
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.debug(
      `Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(
        result,
      )}`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<any>, error) {
    this.logger.error(
      `Processor:@OnQueueFailed - Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
    throw error;
  }

  @Process('get-trips-request')
  async getTrips(job: Job<{ dto: TripsQueryDto /* counter: 1 */ }>) {
    this.logger.log(
      `Processor:@Process - Request to Liknoss: From:${job.data.dto.location_origin} To:${job.data.dto.location_destination} Date:${job.data.dto.date}`,
    );
    try {
      const result = await this.tripService.getTripsFromLinkoss(job.data.dto);
      return result;
    } catch (error) {
      /* if (error.respose?.code !== 502 || job.data.counter > 5) {
        this.logger.error('Failed to update pallex request.', error.stack);
        throw error;
      }
      this.queue.add(
        'single-request',
        { request: job.data.request, counter: job.data.counter + 1 },
        job.opts,
      ); */
      this.logger.error('Bad Liknoss request.', error.stack);
    }
  }

  @Process('read-write-db-trip')
  async readWriteDbTrip(job: Job<{ tripBody: CreateTripDto }>) {
    this.logger.log(
      `Processor:@Process - Request to Postgres: From:${job.data.tripBody.loc_origin} To:${job.data.tripBody.loc_destination} Date:${job.data.tripBody.date_start} Company:${job.data.tripBody.company}`,
    );
    try {
      //db check
      const checkTripInDb = await this.tripRepository.findOne(
        job.data.tripBody,
      );
      if (!checkTripInDb) {
        await this.tripRepository.create(job.data.tripBody);
        this.logger.verbose('CREATE TRIP IN DB');
      } else if (
        checkTripInDb.duration === job.data.tripBody.duration &&
        checkTripInDb.price_basic === job.data.tripBody.price_basic &&
        checkTripInDb.price_discount === job.data.tripBody.price_discount &&
        checkTripInDb.date_start.getTime() ===
          new Date(job.data.tripBody.date_start).getTime() &&
        checkTripInDb.date_end.getTime() ===
          new Date(job.data.tripBody.date_end).getTime()
      ) {
        this.logger.verbose('TRIP IN DB ACTUAL');
      } else {
        await this.tripRepository.update(checkTripInDb?.id, {
          duration: job.data.tripBody.duration,
          price_basic: job.data.tripBody.price_basic,
          price_discount: job.data.tripBody.price_discount,
          date_start: job.data.tripBody.date_start,
          date_end: job.data.tripBody.date_end,
        });
        this.logger.verbose('UPDATE TRIP IN DB');
      }
      //db check end
    } catch (error) {
      this.logger.error('Bad DB request.', error.stack);
    }
  }

  /* async cleanQueue() {
    const counts = await this.queue.getJobCounts();
    console.log('Pallex queue:', { counts });
    await this.queue.clean(0, 'failed');
    await this.queue.clean(0, 'completed');
  } */
}
