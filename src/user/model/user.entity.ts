import { ConectedUserEntity } from 'src/chat/conected-user/models/conected-user.entity';
import { JoinedRoomEntity } from 'src/chat/joined-room/joined-room.entity';
import { MessageEntity } from 'src/chat/message/message.entity';
import { RoomEntity } from 'src/chat/room/models/room.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @ManyToMany(() => RoomEntity, (room) => room.users)
  rooms: RoomEntity[];

  @OneToMany(() => ConectedUserEntity, (conection) => conection.user, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    nullable: true,
  })
  conection: ConectedUserEntity[];

  @OneToMany(() => JoinedRoomEntity, (joinedRooms) => joinedRooms.room)
  joinedRooms: JoinedRoomEntity[];

  @OneToMany(() => MessageEntity, (messages) => messages.user)
  messages: MessageEntity[];
}
