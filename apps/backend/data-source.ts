import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: true, // Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
};

const datasource = new DataSource(dbConfig as DataSourceOptions);
export default datasource;
