import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageRepository } from './message.repository';
import { MessageEntity } from './message.entity';
import { RoomRepository } from '../room/models/room.repository';
import { UserRepository } from 'src/user/model/user.repository';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageRepository)
    private readonly messageRepository: MessageRepository,
    @InjectRepository(RoomRepository)
    private readonly roomRepository: RoomRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async create(data: {
    text: string;
    userId: number;
    roomId: number;
  }): Promise<MessageEntity> {
    const user = await this.userRepository.findOne({
      where: { id: data.userId },
    });
    if (!user) {
      throw new BadRequestException('user not found');
    }
    const room = await this.roomRepository.findOne({
      where: { id: data.roomId },
    });
    if (!room) {
      throw new BadRequestException('room not found');
    }
    const message = this.messageRepository.create({
      text: data.text,
      user,
      room,
      createdAt: new Date(),
    });
    console.log(
      'messprices[j]-prices[i]prices[j]-prices[i]prices[j]-prices[i]prices[j]-prices[i]prices[j]-prices[i]',
    );
    console.log(message);
    return await this.messageRepository.save(message);
  }

  async getMessagesForRoom(roomId: number): Promise<MessageEntity[]> {
    console.log('fcghbskjhbvgd');
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
    });
    if (!room) {
      throw new BadRequestException('room not found');
    }
    console.log('jhecbe');
    const messages = await this.messageRepository.find({
      order: { createdAt: 'ASC' },
      relations: ['room', 'user'],
    });
    return messages.filter((x) => x.room.id === room.id);
  }
}
