import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from '../service';
import { Service } from '../repository';
import { Domain } from '@entities/domain/repository';
import { ServiceController } from '../controller';
import { DomainService } from '@entities/domain/service/domain.service';

@Module({
    imports: [ TypeOrmModule.forFeature([ Service, Domain ]) ],
    controllers: [ ServiceController ],
    providers: [ ServicesService, DomainService ]
})
export class ServiceModule {}