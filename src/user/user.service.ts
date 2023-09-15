import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserEntity } from './model/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './model/user.repository';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LogInDto } from './dto/login-dto';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}
  async create(newUser: CreateUserDto): Promise<UserEntity> {
    if (!newUser) {
      throw new BadRequestException('Your data are not valid');
    }
    const foundUser = await this.userRepository.findOne({
      where: { email: newUser.email },
    });
    if (foundUser) {
      throw new BadRequestException('User already exist');
    }
    const user = this.userRepository.create({
      username: newUser.username,
      email: newUser.email,
      password: await bcrypt.hash(newUser.password, 10),
    });
    return await this.userRepository.save(user);
  }
  async me(token: string): Promise<UserEntity | null> {
    console.log(token);
    const payload = jwt.verify(token, 'JWT_SECRET_KEY') as jwt.JwtPayload;
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
    });
    return user;
  }
  async login(user: LogInDto): Promise<string> {
    if (!user) {
      throw new BadRequestException('Your data are not valid');
    }
    const foundUser = await this.userRepository.findOne({
      where: { email: user.email },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
      },
    });
    if (!foundUser) {
      throw new BadRequestException('User do not exist');
    }
    const matchPassword = await bcrypt.compare(
      user.password,
      foundUser.password,
    );
    if (!matchPassword) {
      throw new UnauthorizedException('Check your password');
    }
    console.log(
      jwt.sign(
        {
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
        },
        'JWT_SECRET_KEY',
        { expiresIn: '14d' },
      ),
    );
    return jwt.sign(
      {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
      },
      'JWT_SECRET_KEY',
      { expiresIn: '14d' },
    );
  }

  async findAll(query: PaginateQuery): Promise<Paginated<UserEntity>> {
    return paginate(query, this.userRepository, {
      sortableColumns: ['id', 'username'],
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['id', 'username'],
    });
  }
}
