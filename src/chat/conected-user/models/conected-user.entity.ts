import { UserEntity } from 'src/user/model/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ConectedUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @ManyToOne(() => UserEntity, (user) => user.conection, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    cascade: true,
  })
  @JoinColumn()
  user: UserEntity;
}
