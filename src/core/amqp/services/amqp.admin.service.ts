
// core/amqp/amqp-admin.service.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  IMessageBrokerAdmin,
  MESSAGE_BROKER_ADMIN,
} from '../interfaces/message-broker.interface';

@Injectable()
export class AmqpAdminService implements IMessageBrokerAdmin {
  constructor(
    @Inject(MESSAGE_BROKER_ADMIN)
    private readonly adapter: IMessageBrokerAdmin,
  ) {}

  async createUser(username: string, password: string): Promise<void> {
    return this.adapter.createUser(username, password);
  }

  async deleteUser(username: string): Promise<void> {
    return this.adapter.deleteUser(username);
  }

  async changePassword(username: string, newPassword: string): Promise<void> {
    return this.adapter.changePassword(username, newPassword);
  }

  async setPermissions(
    username: string,
    vhost: string,
    permissions: { configure: string; write: string; read: string },
  ): Promise<void> {
    return this.adapter.setPermissions(username, vhost, permissions);
  }
}
