import { Module } from '@nestjs/common';
import { LiknossService } from './services/liknoss.service';
import { ApiService } from './services/api.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 60000,
      maxRedirects: 5,
    }),
  ],
  controllers: [],
  providers: [LiknossService, ApiService],
  exports: [LiknossService],
})
export class LiknossModule {}
