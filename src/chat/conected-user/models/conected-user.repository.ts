import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ConectedUserEntity } from './conected-user.entity';

@Injectable()
export class ConectedUserRepository extends Repository<ConectedUserEntity> {
  constructor(private dataSource: DataSource) {
    super(ConectedUserEntity, dataSource.createEntityManager());
  }
}
