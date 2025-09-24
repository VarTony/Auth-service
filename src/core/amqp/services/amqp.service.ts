// core/amqp/amqp.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { IMessageBroker, MESSAGE_BROKER } from '../interfaces/message-broker.interface';

// Класс представляет из себя фасад для внешних пользователей
@Injectable()
export class AmqpService implements IMessageBroker {
  constructor(
    @Inject(MESSAGE_BROKER)
    private readonly adapter: IMessageBroker,
) {}

  async connectSecretExchange(): Promise<void> {
    return this.adapter.connectSecretExchange();
  }

  async publishSecret(secret: string): Promise<void> {
    return this.adapter.publishSecret(secret);
  }
}
