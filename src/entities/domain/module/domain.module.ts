import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainService } from '../service';
import { Domain } from '../repository/domain.model';
import { SecretModule } from '@secret/index';

@Module({
  imports: [TypeOrmModule.forFeature([Domain]), SecretModule],
  providers: [DomainService]
})
export class DomainModule {}
