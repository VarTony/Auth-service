import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { IMessageBrokerAdmin } from '../../interfaces/message-broker.interface';


@Injectable()
export class RabbitMqAdminAdapter implements IMessageBrokerAdmin {
  private client;
  constructor(private readonly config: ConfigService) {
    this.client = axios.create({
      baseURL: this.config.get('amqMgmtUrl'),
      auth: {
        username: this.config.get('amqMgmtUser'),
        password: this.config.get('amqMgmtPass'),
      },
    });
  }

  async createUser(username: string, password: string): Promise<void> {
    await this.client.put(`/users/${encodeURIComponent(username)}`, {
      password,
      tags: '',
    });
  }

  async deleteUser(username: string): Promise<void> {
    await this.client.delete(`/users/${encodeURIComponent(username)}`);
  }

  async changePassword(username: string, newPassword: string): Promise<void> {
    await this.client.put(`/users/${encodeURIComponent(username)}`, {
      password: newPassword,
      tags: '',
    });
  }

  async setPermissions(
    username: string,
    vhost: string,
    permissions: { configure: string; write: string; read: string },
  ): Promise<void> {
    await this.client.put(
      `/permissions/${encodeURIComponent(vhost)}/${encodeURIComponent(username)}`,
      permissions,
    );
  }
}
