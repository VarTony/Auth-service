import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Secret } from '../repository'; 
import { SecretService } from '../service/secret.service';
import { SecretController } from '@secret/controller/secret.controller';
import { ConfigService } from '@nestjs/config';
import { AMQPService } from 'src/core/amqp/service/amqp.service.utility';


@Module({
  imports: [ TypeOrmModule.forFeature([Secret])],
  controllers: [ SecretController ],
  providers: [ SecretService, ConfigService, AMQPService ],
})
export class SecretModule {}
