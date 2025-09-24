import { Controller, Logger } from '@nestjs/common';
import { SecretService } from '../service/secret.service';
import { Interval } from '@nestjs/schedule';
import { AmqpService } from 'src/core/amqp/services';

const secretBroadcastInterval = +process.env.SECRET_BROADCAST_INTERVAL_MS || 720_00;


@Controller('secret')
export class SecretController {
    private readonly logger = new Logger(SecretController.name);

    constructor(
        private readonly amqpService: AmqpService,
        private readonly service: SecretService
    ) {}


    @Interval(secretBroadcastInterval)
    async temporarySecretBroadcastRpc() {
        try {
            const secret = await this.service.getCurrentTemporarySecret() ?? '1 8 15 16 23 42';
            const channel = await this.amqpService.connectSecretExchange();
            await this.amqpService.publishSecret(secret);
            this.logger.log(`Temp secret success broadcasted. \n Time: ${new Date()}`);
        } catch (err) {
            console.error(err);
        }
    }
}
