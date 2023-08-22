import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Bind, Controller, Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { SecretService } from '../service/secret.service';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';


@Controller('secret')
export class SecretController {
    private readonly logger = new Logger(SecretController.name);
    private readonly tempAccessSecretLivetimeInMs = +process.env.TEMP_ACCESS_SECRET_LIVETIME_IN_MS;

    constructor(
        private readonly service: SecretService
    ) {}


    // @Interval(5000)
    // @RabbitRPC({
    //     routingKey: 'tempsecret.create',
    //     exchange: process.env.AMQP_EXCHANGE_SECRET_NAME,
    //     queue: 'tempsecret-create',
    //     createQueueIfNotExists: true,
    //     queueOptions: {
    //         durable: true,
    //         // channel: 'secret.broadcast',
    //         messageTtl: +process.env.TEMP_ACCESS_SECRET_LIVETIME_IN_MS  + +process.env.ACCESS_TOKEN_EXPIRATION,
    //         maxLength: 2,
    //         // deadLetterExchange: 
    //     }
    //   })
    async temporarySecretBroadcastRpc() {
        console.log({ TEMP_ACCESS_SECRET_LIVETIME_IN_MS: process.env.TEMP_ACCESS_SECRET_LIVETIME_IN_MS });
        const secret = '1 8 15 16 23 42'; //await this.service.getCurrentTemporarySecret() ??
        this.logger.log(`Temp secret success broadcasted. \n Time: ${new Date()}`);

        return  { msg: secret };
      }
}
