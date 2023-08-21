import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomService } from './room/room.service';
import { RoomEntity } from './room/models/room.entity';
import { MessageEntity } from './message/message.entity';
import { MessageService } from './message/message.service';
import { RoomRepository } from './room/models/room.repository';
import { UserRepository } from 'src/user/model/user.repository';
import { MessageRepository } from './message/message.repository';
import { JoinedRoomEntity } from './joined-room/joined-room.entity';
import { JoinedRoomService } from './joined-room/joined-room.service';
import { JoinedRoomRepository } from './joined-room/joined-room.repository';
import { ConectedUserService } from './conected-user/conected-user.service';
import { ConectedUserEntity } from './conected-user/models/conected-user.entity';
import { ConectedUserRepository } from './conected-user/models/conected-user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomEntity,
      ConectedUserEntity,
      JoinedRoomEntity,
      MessageEntity,
    ]),
  ],
  providers: [
    ChatGateway,
    UserRepository,
    RoomService,
    RoomRepository,
    ConectedUserService,
    ConectedUserRepository,
    JoinedRoomRepository,
    MessageRepository,
    JoinedRoomService,
    MessageService,
  ],
})
export class ChatModule {}
