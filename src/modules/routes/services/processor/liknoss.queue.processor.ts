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

@Injectable()
@Processor('liknoss-queue')
export class LiknossQueueProcessor {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly tripSrvice: TripService,

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
      const result = await this.tripSrvice.getTripsFromLinkoss(job.data.dto);
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

  /* async cleanQueue() {
    const counts = await this.queue.getJobCounts();
    console.log('Pallex queue:', { counts });
    await this.queue.clean(0, 'failed');
    await this.queue.clean(0, 'completed');
  } */
}
