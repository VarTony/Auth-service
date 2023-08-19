import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { SecretController } from '@secret/controller/secret.controller';
import { ConfigService } from '@nestjs/config';
import { SecretService } from '@secret/service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Secret } from '@secret/repository';


@Module({
  imports: [
    TypeOrmModule.forFeature([ Secret ]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      
      useFactory: async (config: ConfigService) => {
        const login = config.get('amqLogin');
        const pass = config.get('amqPass');
        const host = `${ config.get('amqHost') }:${ config.get('amqPort') }`;
        const mainExchange = config.get('amqMainExchange');
        console.log(mainExchange);

        const exchanges = [ { name: mainExchange, type: 'topic' } ];
        const uri = `amqp://${ login }:${ pass }@${ host }`;
        const connectionInitOptions = { wait: false };
        return { exchanges, uri, connectionInitOptions };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [ SecretController ],
  providers: [ SecretService ]
})
export class AMQPConnection {}
