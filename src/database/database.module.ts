import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const ENTITIES_DIR = 'dist/**/*.entity.js';
export const MIGRATION_FILES_DIR = 'dist/database/migrations/*.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        database: configService.get<string>('DATABASE_NAME'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        port: Number(configService.get<string>('DATABASE_PORT')),
        entities: [ENTITIES_DIR],
        synchronize: false,
        migrations: [MIGRATION_FILES_DIR],
      }),
    }),
  ],
})
export class DatabaseModule {}
