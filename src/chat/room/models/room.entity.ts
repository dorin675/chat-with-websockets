import { JoinedRoomEntity } from 'src/chat/joined-room/joined-room.entity';
import { MessageEntity } from 'src/chat/message/message.entity';
import { UserEntity } from 'src/user/model/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => UserEntity, (user) => user.rooms)
  @JoinTable()
  users: UserEntity[];

  @OneToMany(() => JoinedRoomEntity, (joinedUsers) => joinedUsers.user)
  joinedUsers: JoinedRoomEntity[];

  @OneToMany(() => MessageEntity, (messages) => messages.room)
  messages: MessageEntity[];
}
