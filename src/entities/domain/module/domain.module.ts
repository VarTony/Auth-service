import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainService } from '../service';
import { Domain } from '../repository/domain.repositoty';

@Module({
  imports: [TypeOrmModule.forFeature([Domain])],
  providers: [DomainService]
})
export class DomainModule {}
