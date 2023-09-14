import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinedRoomRepository } from './joined-room.repository';
import { JoinedRoomEntity } from './joined-room.entity';
import { RoomRepository } from '../room/models/room.repository';
import { UserRepository } from 'src/user/model/user.repository';

@Injectable()
export class JoinedRoomService {
  constructor(
    @InjectRepository(JoinedRoomRepository)
    private readonly joinedRoomRepository: JoinedRoomRepository,
    @InjectRepository(RoomRepository)
    private readonly roomRepository: RoomRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async create(
    socketId: string,
    userId: number,
    roomId: number,
  ): Promise<JoinedRoomEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('user not found');
    }
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new BadRequestException('room not found');
    }
    const joinedRoom = this.joinedRoomRepository.create({
      socketId,
      room,
      user,
    });
    console.log('roomroomroomroomroomroomroom');
    console.log(joinedRoom);
    return await this.joinedRoomRepository.save(joinedRoom);
  }

  async findByUser(userId: number): Promise<JoinedRoomEntity[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('user not found');
    }
    const joinedRooms = await this.joinedRoomRepository.find({
      relations: {
        user: true,
      },
    });
    return joinedRooms.filter((x) => x.user.id === user.id);
  }

  async findByRoom(roomId: number): Promise<JoinedRoomEntity[]> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new BadRequestException('room not found');
    }
    const joinedRooms = await this.joinedRoomRepository.find({
      relations: {
        room: true,
        user: true,
      },
    });
    return joinedRooms.filter((x) => x.room.id === room.id);
  }

  async deleteBySocketId(socketId: string) {
    await this.joinedRoomRepository.delete({ socketId });
  }

  async deleteAll() {
    await this.joinedRoomRepository.createQueryBuilder().delete().execute();
  }
}
