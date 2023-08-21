import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { MessageEntity } from './message.entity';

@Injectable()
export class MessageRepository extends Repository<MessageEntity> {
  constructor(private dataSource: DataSource) {
    super(MessageEntity, dataSource.createEntityManager());
  }
}
