import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Secret } from '@secret/repository';
import { SecretService } from '../service/secret.service';

@Module({
  imports: [TypeOrmModule.forFeature([Secret])],
  providers: [SecretService]
})
export class SecretModule {}
