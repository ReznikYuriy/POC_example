import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configs from 'src/configs';
import { SequelizeModule } from '@nestjs/sequelize';
import { CacheModule } from '@nestjs/cache-manager';
import { RoutesModule } from './routes/routes.module';
import { LiknossModule } from './liknoss/liknoss.module';
import LocationModel from './routes/shemas/location.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      ...configs.postgres,
      dialect: 'postgres',
      autoLoadModels: true,
      synchronize: true,
      models: [LocationModel],
    }),
    CacheModule.register({
      isGlobal: true,
      host: configs.redis.host,
      port: configs.redis.port,
      ttl: configs.redis.ttl,
    }),
    RoutesModule,
    LiknossModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
