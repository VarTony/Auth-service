import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitMQAdapter } from '../addapters';
import { RabbitConnection } from '@connections/index';

@Module({
  

  providers: [ ConfigService, RabbitMQAdapter ],
  exports: []
})
export class AMQPModule {}