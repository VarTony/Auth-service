import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Domain } from './domain.model';

@Injectable()
export class DomainRepository extends Repository<Domain> {
  constructor(private readonly dataSource: DataSource) {
    super(Domain, dataSource.createEntityManager());
  }
}
