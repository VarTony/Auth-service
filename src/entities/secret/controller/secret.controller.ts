import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Controller, Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { SecretService } from '../service/secret.service';
import { Cron } from '@nestjs/schedule';
import { TEMP_ACCESS_SECRET_LIVETIME_IN_SEC } from '@secret/constant/secret.const';
import { ConfigService } from '@nestjs/config';

@Controller('secret')
export class SecretController {
    private readonly logger = new Logger(SecretController.name);

    constructor(
        private readonly service: SecretService
    ) {}
    
    
    // @Cron(`${ TEMP_ACCESS_SECRET_LIVETIME_IN_SEC } * * * * *`, { name: 'temp secret broadcast' })
    @RabbitRPC({
        routingKey: 'broadcast.temp.secret',
        exchange: process.env.AMQP_EXCHANGE_NAME,
        queue: 'intercepted-rpc-2',
      })
    async temporarySecretBroadcastRpc() {
        const secret = await this.service.getCurrentTemporarySecret();
        this.logger.log(`Temp secret success broadcasted. \n Time: ${new Date()}`);

        return  { tempSecret: secret };
      }
}
