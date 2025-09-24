import { Body, Controller, Logger, Post } from '@nestjs/common';
import { DomainService } from '../service/domain.service';
import { CreateDomainDto } from '@domain/types';

@Controller('domain')
export class DomainController {
  private readonly logger = new Logger(DomainController.name);

  constructor(private readonly service: DomainService) {}

  @Post()
  async registeryNewDomain(@Body() body: CreateDomainDto) {
    try {
      const result = await this.service.addNewDomain(body);

      if (result.status === 200) this.logger.log(`${JSON.stringify(result)}`);
      else this.logger.warn(`${JSON.stringify(result)}`);

      return result; // вернуть клиенту результат работы сервиса
    } catch (err) {
      this.logger.error('Error in registeryNewDomain', err);
      return { result: 'error', status: 500 };
    }
  }
}
