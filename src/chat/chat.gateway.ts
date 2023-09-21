import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

import { JwtPayload } from 'jsonwebtoken';
import { UserRepository } from 'src/user/model/user.repository';
import {
  BadRequestException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { RoomService } from './room/room.service';
import { RoomEntity } from './room/models/room.entity';
import { ConectedUserService } from './conected-user/conected-user.service';
import { JoinedRoomService } from './joined-room/joined-room.service';
import { MessageService } from './message/message.service';
import { RoomRepository } from './room/models/room.repository';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayConnection, OnModuleInit
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roomService: RoomService,
    private readonly conectedUserService: ConectedUserService,
    private readonly joinedRoomService: JoinedRoomService,
    private readonly roomRepository: RoomRepository,
    private readonly messageService: MessageService,
  ) {}
  async onModuleInit() {
    await this.conectedUserService.deleteAll();
    await this.joinedRoomService.deleteAll();
  }
  @WebSocketServer() server: Socket;

  async handleConnection(client: Socket) {
    console.log(client.id, ' connected');

    try {
      const token = client.handshake.headers?.authorization;
      if (!token) {
        client.disconnect();
        throw new UnauthorizedException('Insert token');
      }
      const payload = jwt.verify(token, 'JWT_SECRET_KEY') as JwtPayload;
      console.log('payload', payload);
      if (!payload) {
        client.disconnect();
        throw new BadRequestException('token is not valid');
      }
      const user = await this.userRepository.findOne({
        where: { id: payload.id },
      });
      if (!user) {
        client.disconnect();
        throw new BadRequestException('User does not exist in db');
      }
      client.data.user = user;
      this.server.emit(
        'message',
        `user ${user.username} with id ${client.data.user.id} has conected`,
      );
      const rooms = await this.roomService.getRoomsForUser(user.id);
      await this.conectedUserService.create(client.id, client.data.user.id);
      this.server.to(client.id).emit('rooms', rooms);
    } catch (error) {
      console.log(error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(client.data.user.username, ' disconnected');
    await this.conectedUserService.deleteBySocketId(client.id);
    client.disconnect();
  }

  @SubscribeMessage('createRoom')
  async createRoom(client: Socket, payload: string): Promise<RoomEntity> {
    const conections = await this.conectedUserService.getAllConectionsForUser(
      client.data.user.id,
    );
    const room = await this.roomService.createRoom({
      name: payload,
      idCreator: client.data.user.id,
    });
    conections.forEach((x) => this.server.to(x.socketId).emit('rooms', room));
    return room;
  }
  @SubscribeMessage('addToRoom')
  async addToRoom(
    client: Socket,
    payload: { roomId: number; userId: number },
  ): Promise<RoomEntity> {
    const conections = await this.conectedUserService.getAllConectionsForUser(
      payload.userId,
    );
    const room = await this.roomService.addUserToRoom(
      payload.roomId,
      payload.userId,
    );
    conections.forEach((x) => this.server.to(x.socketId).emit('rooms', room));
    return room;
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(client: Socket, roomId: number) {
    console.log('try jo join');
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: {
        users: true,
      },
    });
    if (!room) {
      this.server.to(client.id).emit('general', 'Room does not exist');
    }
    if (!room?.users.map((x) => x.id).includes(client.data.user.id)) {
      this.server.to(client.id).emit('general', 'you are not in this room');
    } else {
      const messages = await this.messageService.getMessagesForRoom(roomId);
      await this.joinedRoomService.create(
        client.id,
        client.data.user.id,
        roomId,
      );
      this.server.to(client.id).emit('messages', messages);
    }
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(client: Socket) {
    await this.joinedRoomService.deleteBySocketId(client.id);
  }

  @SubscribeMessage('sendMessage')
  async onSendMessage(
    client: Socket,
    message: { text: string; userId: number; roomId: number },
  ) {
    if (!message.text) {
      throw new BadRequestException('Message should not be empty');
    }

    if (message.userId !== client.data.user.id) {
      throw new BadRequestException('not the same id');
    }

    const joinedRooms = await this.joinedRoomService.findByUser(message.userId);
    console.log(joinedRooms);
    if (!joinedRooms.map((x) => x.user.id).includes(message.userId)) {
      throw new BadRequestException('you have not joined the room');
    }
    const joinedUsers = await this.joinedRoomService.findByRoom(message.roomId);

    console.log('joinedUsers', joinedUsers);
    if (!joinedUsers.map((x) => x.user.id).includes(message.userId)) {
      throw new BadRequestException('user is not joined in the room');
    }

    const createdMessage = await this.messageService.create(message);

    for (const user of joinedUsers) {
      this.server.to(user.socketId).emit('messages', createdMessage);
    }
  }

  // @SubscribeMessage('chatToRoom')
  // async chatToRoom(client: Socket, payload: any): Promise<RoomEntity> {
  //   console.log(2);
  //   return await this.roomService.addUserToRoom(15, payload);
  // }
}
