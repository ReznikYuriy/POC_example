import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configs from 'src/configs';
import { SequelizeModule } from '@nestjs/sequelize';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    SequelizeModule.forRoot({
      ...configs.postgres,
      dialect: 'postgres',
      autoLoadModels: true,
      synchronize: true,
      models: [],
    }),
    CacheModule.register({
      isGlobal: true,
      host: configs.redis.host,
      port: configs.redis.port,
      ttl: configs.redis.ttl,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
