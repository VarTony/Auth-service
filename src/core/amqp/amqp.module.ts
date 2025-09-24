import { Global, Module } from '@nestjs/common';
import { RabbitConnection } from '@connections/AMQP/rabbit.connection.module';
import { RabbitMqAdminAdapter, RabbitMqAdapter } from './brokers';
import { MESSAGE_BROKER, MESSAGE_BROKER_ADMIN } from './interfaces';
import { AmqpService, AmqpAdminService } from './services';


@Global()
@Module({
  imports: [RabbitConnection],
  providers: [
    {
      provide: MESSAGE_BROKER, // токен интерфейса завязывается на реализацию
      useClass: RabbitMqAdapter // реализация
    },
    {
      provide: MESSAGE_BROKER_ADMIN,
      useClass: RabbitMqAdminAdapter
    },
    AmqpService,
    AmqpAdminService,
  ],
  // providers: [RabbitMqAdapter, RabbitMqAdapter],
  exports: [AmqpService, AmqpAdminService],
})
export class AMQPModule {}