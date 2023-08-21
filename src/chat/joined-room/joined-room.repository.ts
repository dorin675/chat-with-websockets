import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { JoinedRoomEntity } from './joined-room.entity';

@Injectable()
export class JoinedRoomRepository extends Repository<JoinedRoomEntity> {
  constructor(private dataSource: DataSource) {
    super(JoinedRoomEntity, dataSource.createEntityManager());
  }
}
