import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Secret } from '../repository'; 
import { SecretService } from '../service/secret.service';
import { SecretController } from '@secret/controller/secret.controller';
import { AMQPModule } from 'src/core/amqp/module/amqp.module.utility';


@Module({
  imports: [ TypeOrmModule.forFeature([Secret]), AMQPModule],
  controllers: [ SecretController ],
  providers: [ SecretService ],
})
export class SecretModule {}
