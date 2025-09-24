import { DomainService } from '@domain/service';
import { CreateDomainDto } from '@domain/types/DTO';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class DomainConsumer {
  constructor(private readonly domainService: DomainService) {}

  @RabbitSubscribe({
    exchange: 'domain',
    routingKey: 'domain.deactivate',
    queue: 'domain-secret-queue',
  })
  async handleDeactivateDomain(msg: any) {
    return this.domainService.deactivateDomain(msg.name);
  }


  /**
   * Обработчик события создания нового домена.
   * Принимает данные из очереди, прогоняет их через DTO и валидацию.
   * Если всё корректно — передаёт в сервис для регистрации домена.
   *
   * @param msg - данные для создания домена (name, password, secret, host)
   * @returns результат операции (успех или ошибка)
   */
  @RabbitSubscribe({
    exchange: 'domain',
    routingKey: 'domain.deactivate',
    queue: 'domain-secret-queue',
  })
  async handleAddNewDomain(msg: CreateDomainDto) {
    const dto = plainToInstance(CreateDomainDto, msg);
    const errors = await validate(dto);

    if (errors.length) throw new Error(`Validation failed: ${errors}`);

    return this.domainService.addNewDomain(msg);
  }
}
