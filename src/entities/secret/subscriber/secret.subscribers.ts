import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { SecretService } from "@secret/service";


@Injectable()
export class SecretConsumer {
  constructor(private readonly secretService: SecretService) {}

  @RabbitSubscribe({
    exchange: 'domain',
    routingKey: 'domain.secret.get',
    queue: 'domain-secret-queue',
  })
  async handleGetDomainSecret(msg: string) {
    return this.secretService.getCurrentTemporarySecret();
  }
}
