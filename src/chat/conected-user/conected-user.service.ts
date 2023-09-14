import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConectedUserRepository } from './models/conected-user.repository';
import { UserRepository } from 'src/user/model/user.repository';

@Injectable()
export class ConectedUserService {
  constructor(
    @InjectRepository(ConectedUserRepository)
    private readonly conectedUserRepository: ConectedUserRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async getAllConectionsForUser(userId: number) {
    const conecttions = await this.conectedUserRepository.find({
      relations: { user: true },
    });
    return conecttions.filter((x) => x.user.id === userId);
  }

  async create(socketId: string, userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    const connectedUser = this.conectedUserRepository.create({
      socketId: socketId,
      user: user,
    });
    console.log('esdjn');
    console.log(connectedUser);
    await this.conectedUserRepository.save(connectedUser);
    console.log(user);
    console.log('test10');
  }

  async findByUser(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    const conectedUsers = await this.conectedUserRepository.find({
      relations: {
        user: true,
      },
    });
    return conectedUsers.filter((x) => x.user.id === user.id);
  }

  async deleteBySocketId(socketId: string) {
    return await this.conectedUserRepository.delete({ socketId });
  }

  async deleteAll() {
    await this.conectedUserRepository.createQueryBuilder().delete().execute();
  }
}
