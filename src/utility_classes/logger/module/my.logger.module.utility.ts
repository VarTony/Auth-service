import { Module } from '@nestjs/common';
import { MyLoggerService } from '../service/my.logger.service.utility';
@Module({
  providers: [MyLoggerService],
  exports: [MyLoggerService]
})
export class MyLoggerModule {}