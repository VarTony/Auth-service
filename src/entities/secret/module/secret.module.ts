import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Secret } from '@secret/repository'; 
import { SecretService } from '../service/secret.service';
import { SecretController } from '@secret/controller/secret.controller';
import { ConfigService } from '@nestjs/config';
// import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [ TypeOrmModule.forFeature([Secret])],
  controllers: [ SecretController ],
  providers: [ SecretService, ConfigService,  ],
})
export class SecretModule {}
