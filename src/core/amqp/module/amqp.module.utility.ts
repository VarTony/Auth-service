import { Global, Module } from '@nestjs/common';
import { AMQPService } from '../service/amqp.service.utility';
import { RabbitConnection } from '@connections/AMQP/rabbit.connection.module';

@Global()
@Module({
  imports: [RabbitConnection],
  providers: [AMQPService],
  exports: [AMQPService],
})
export class AMQPModule {}