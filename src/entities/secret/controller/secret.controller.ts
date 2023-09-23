import { Controller, Logger } from '@nestjs/common';
import { SecretService } from '../service/secret.service';
import { Interval } from '@nestjs/schedule';
import { AMQPService } from 'src/core/amqp/service/amqp.service.utility';


@Controller('secret')
export class SecretController {
    private readonly logger = new Logger(SecretController.name);

    constructor(
        private readonly amqpService: AMQPService,
        private readonly service: SecretService
    ) {}


    @Interval(5000)
    async temporarySecretBroadcastRpc() {
        try {
            const secret = '1 8 15 16 23 42'; //await this.service.getCurrentTemporarySecret() ??
            const channel = await this.amqpService.connectSecretExchange();
            await this.amqpService.publishSecret(channel, secret);
            this.logger.log(`Temp secret success broadcasted. \n Time: ${new Date()}`);
        } catch (err) {
            console.error(err);
        }
    }
}
