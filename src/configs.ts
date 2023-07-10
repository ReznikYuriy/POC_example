import * as dotenv from 'dotenv';

const configs =
  process.env.NODE_ENV === 'development'
    ? { path: `.env${process.env.NODE_ENV}` }
    : { path: `.env` };

dotenv.config(configs);

export default {
  postgres: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE_NAME || 'poc_local',
  },
  port: process.env.PORT || 8000,
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    ttl: Number(process.env.TTL) || 14400,
  },
  frontUrl: process.env.FRONT_URL || 'http://localhost:8000',
  backUrl: process.env.BACK_URL || 'http://localhost:8000',
};
