import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Secret } from '@secret/repository';
import { SecretService } from '@secret/service/secret.service';
import { MyLoggerService } from '@utility_classes/logger';

@Module({
  imports: [TypeOrmModule.forFeature([Secret])],
  providers: [SecretService, MyLoggerService],
})
export class SecretModule {}
