import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Secret } from '@secret/repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Secret ]),
    RabbitMQModule.forRootAsync (RabbitMQModule, {
      useFactory: async (config: ConfigService) => {
        const login = config.get('amqLogin');
        const pass = config.get('amqPass');
        const host = `${ config.get('amqHost') }:${ config.get('amqPort') }`;
        const domainExchange = config.get('amqDomainExchange');
        const secretExchange = config.get('amqSecretExchange');

        const exchanges = [ 
          { name: domainExchange, type: 'topic' },
          { name: secretExchange, type: 'topic' }
        ];
        const uri = `amqp://${ login }:${ pass }@${ host }`;
        const connectionInitOptions = { wait: false };
        return { exchanges, uri, connectionInitOptions };
      },
      inject: [ConfigService],
    }),
  ],
   exports: [RabbitMQModule]
})
export class RabbitConnection {}
