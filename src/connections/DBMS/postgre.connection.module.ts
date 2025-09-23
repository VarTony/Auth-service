import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.info('===config.get===', 
          config.get<string>('POSTGRES_USER'),
          config.get<string>('POSTGRES_HOST'),
          config.get<number>('POSTGRES_PORT'),
          config.get<string>('POSTGRES_PASS'),
          config.get<string>('POSTGRES_DB'),
          { config }
        );
        
        return ({
        type: 'postgres',
        host: config.get<string>('POSTGRES_HOST'),
        port: config.get<number>('POSTGRES_PORT'),
        username: config.get<string>('POSTGRES_USER'),
        password: config.get<string>('POSTGRES_PASS'),
        database: config.get<string>('POSTGRES_DB'),
        entities: [
          path.join(__dirname, '../../entities/**/*.model{.ts,.js}'),
        ],
        synchronize: true,
      })
    }
    }),
  ],
})
export class PostgreConnection {}
