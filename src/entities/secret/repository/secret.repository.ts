import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Secret } from './secret.model';

@Injectable()
export class SecretRepository extends Repository<Secret> {
  constructor(private readonly dataSource: DataSource) {
    super(Secret, dataSource.createEntityManager());
  }
}