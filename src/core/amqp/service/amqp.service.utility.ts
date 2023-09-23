import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AMQP_CONFIG } from '@config/amqp.config';
import { RabbitMQAdapter } from '../addapters';
import { Channel } from 'amqp-connection-manager';


@Injectable()
export class AMQPService {
    private readonly CONFIG = AMQP_CONFIG();

    constructor(
        private readonly config: ConfigService,
        private readonly amqpAddapter: RabbitMQAdapter
    ) {
        this.amqpAddapter.connect();
        // this.connection = amqplib.connect(this.config.get('amqURI'), (err, connect) => {});
    }

    async connectSecretExchange(): Promise<Channel> {
        // await this.amqpAddapter.connect();
        const channel = await this.amqpAddapter.createChannel();
        this.amqpAddapter.declareExchange(channel, this.CONFIG.amqSecretExchange, 'fanout');
        this.amqpAddapter.bindQueuesToExchange(
            channel,
            ['secret-broadcasting'],
            this.CONFIG.amqSecretExchange
        );
        return channel;
    }


    async publishSecret(channel: Channel, secret: string): Promise<void> {
        try {
        await this.amqpAddapter.publishToExchange(
            channel,
            this.CONFIG.amqSecretExchange,
            secret
        );
        console.info('The secret was published');
        } catch (err) {
            console.error('');
            throw err;
        }
    }
}
