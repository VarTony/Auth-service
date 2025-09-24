import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Secret } from '../repository'; 
import { SecretService } from '../service/secret.service';
import { SecretController } from '@secret/controller/secret.controller';
import { AMQPModule } from 'src/core/amqp/amqp.module';


@Module({
  imports: [ TypeOrmModule.forFeature([Secret]), AMQPModule],
  controllers: [ SecretController ],
  providers: [ SecretService ],
  exports: [ SecretService ]
})
export class SecretModule {}
