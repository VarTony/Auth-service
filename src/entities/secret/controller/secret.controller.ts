import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Controller, Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { SecretService } from '../service/secret.service';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { TEMP_ACCESS_SECRET_LIVETIME_IN_MS } from '@secret/constant/secret.const';
import { ConfigService } from '@nestjs/config';

@Controller('secret')
export class SecretController {
    private readonly logger = new Logger(SecretController.name);

    constructor(
        private readonly service: SecretService
    ) {}
    
    
    @Timeout(5000)
    @Interval(TEMP_ACCESS_SECRET_LIVETIME_IN_MS)
    @RabbitRPC({
        routingKey: 'tempsecret.create',
        exchange: process.env.AMQP_EXCHANGE_SECRET_NAME,
        queue: 'tempsecret-create',
        createQueueIfNotExists: true,
        queueOptions: {
            durable: true,
            // channel: 'secret.broadcast',
            messageTtl: TEMP_ACCESS_SECRET_LIVETIME_IN_MS + +process.env.ACCESS_TOKEN_EXPIRATION,
            maxLength: 2,
            // deadLetterExchange: 
        }
      })
    async temporarySecretBroadcastRpc() {
        const secret = '1 8 15 16 23 42'; //await this.service.getCurrentTemporarySecret() ??
        this.logger.log(`Temp secret success broadcasted. \n Time: ${new Date()}`);

        return  { msg: secret };
      }
}
