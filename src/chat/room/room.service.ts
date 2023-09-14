import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomRepository } from './models/room.repository';
import { UserRepository } from 'src/user/model/user.repository';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomEntity } from './models/room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomRepository)
    private readonly roomRepository: RoomRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}
  async createRoom(roomData: CreateRoomDto): Promise<any> {
    const creator = await this.userRepository.findOne({
      where: { id: roomData.idCreator },
      relations: {
        rooms: true,
      },
      select: {
        id: true,
        email: true,
        username: true,
        rooms: true,
      },
    });
    if (!creator) {
      throw new BadRequestException('id is not valid');
    }
    const newRoom = this.roomRepository.create({
      name: roomData.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      users: [creator],
    });
    creator.rooms.push(newRoom);
    console.log(newRoom);
    await this.roomRepository.save(newRoom);
    console.log(creator);
    await this.userRepository.save(creator);
    return newRoom;
  }
  async addUserToRoom(roomId: number, userId: number): Promise<RoomEntity> {
    const newUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!newUser) {
      throw new BadRequestException('user not found');
    }
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: { users: true },
      select: {
        users: true,
      },
    });
    if (!room) {
      throw new BadRequestException('room not found');
    }
    if (!room.users.map((user) => user.id).includes(newUser.id)) {
      room.users.push(newUser);
      room.updatedAt = new Date();
    }
    console.log(room);
    return await this.roomRepository.save(room);
  }
  async getRoomsForUser(userId: number): Promise<RoomEntity[]> {
    const newUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        rooms: true,
      },
      select: {
        id: true,
        rooms: true,
      },
    });
    if (!newUser) {
      throw new BadRequestException('user not found');
    }
    console.log('user', newUser);
    return newUser.rooms;
  }
}
