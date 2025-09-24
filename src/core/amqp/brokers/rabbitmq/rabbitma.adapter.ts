import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { IMessageBroker } from '../../interfaces/message-broker.interface';

@Injectable()
export class RabbitMqAdapter implements IMessageBroker {
  constructor(
    private readonly config: ConfigService,
    private readonly amqp: AmqpConnection,
  ) {}

  /**
   * Регистрируем exchange/queue, если хотим вручную управлять топологией.
   * Через addSetup гарантируем, что биндинги восстановятся при reconnect.
   */
  async connectSecretExchange(): Promise<void> {
    await this.amqp.managedChannel.addSetup(async (channel) => {
      const exchange = this.config.get('amqSecretExchange');
      const queue = 'secret-broadcasting';

      await channel.assertExchange(exchange, 'fanout', { durable: true });
      await channel.assertQueue(queue, { durable: true });
      await channel.bindQueue(queue, exchange, '');
    });
  }

  /**
   * Публикация сообщения в обменник secret.
   * 
   * @param secret
   */
  async publishSecret(secret: string): Promise<void> {
    try {
      await this.amqp.publish(
        this.config.get('amqSecretExchange'),
        '', // routingKey пустой, т.к. fanout
        secret,
      );
      console.info('Secret published:', secret);
    } catch (err) {
      console.error('Error publishing secret:', err);
      throw err;
    }
  }
}