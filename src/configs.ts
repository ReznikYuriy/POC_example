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
  liknoss: {
    url:
      process.env.LIKNOSS_URL ||
      'https://gds.liknoss.com/cws/resources/web-services/v200/b2b/',
    agency_code: process.env.LIKNOSS_HEADER_AGENCY_CODE,
    agency_user_name: process.env.LIKNOSS_HEADER_AGENCY_USER_NAME,
    agency_password: process.env.LIKNOSS_HEADER_AGENCY_PASSWORD,
    agency_signature: process.env.LIKNOSS_HEADER_AGENCY_SIGNATURE,
    language_code: process.env.LIKNOSS_HEADER_LANGUAGE_CODE || 'en',
  },
};
