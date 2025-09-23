import { DomainService } from "@domain/service";
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";


@Injectable()
export class DomainConsumer {
  constructor(private readonly domainService: DomainService) {}

  @RabbitSubscribe({
    exchange: 'domain',
    routingKey: 'domain.deactivate',
    queue: 'domain-secret-queue',
  })
  async handleDeactivateDomain(msg: any) {
    return this.domainService.deactivateDomain(msg.name)
  }
}
