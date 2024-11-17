import { DataSource } from 'typeorm';
import { ENTITIES_DIR, MIGRATION_FILES_DIR } from './database.module';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: Number(process.env.DATABASE_PORT),
  entities: [ENTITIES_DIR],
  synchronize: false,
  migrations: [MIGRATION_FILES_DIR],
});
