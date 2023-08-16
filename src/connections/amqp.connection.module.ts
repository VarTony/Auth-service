import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        // {
        //   name: process.env.AMQP_EXCHANGE_SECRET,
        //   type: 'fanaut',
        // },
        {
          name: 'amq.direct', //process.env.AMQP_EXCHANGE_SECRET,
          type: 'direct',
        },
      ],
      //   queue: [],

      uri: 'amqp://useruno:uno0987654321@192.168.1.106:5675', // `amqp://${ process.env.AMQP_HOST }:${ process.env.AMQP_PORT }`,
      connectionInitOptions: { wait: false },
    }),
  ],
})
export class AMQPConnection {}
