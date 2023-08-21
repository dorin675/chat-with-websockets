import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RoomEntity } from './room.entity';

@Injectable()
export class RoomRepository extends Repository<RoomEntity> {
  constructor(private dataSource: DataSource) {
    super(RoomEntity, dataSource.createEntityManager());
  }
}
