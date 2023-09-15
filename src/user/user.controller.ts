import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInDto } from './dto/login-dto';
import { UserEntity } from './model/user.entity';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async create(@Body() createUser: CreateUserDto): Promise<CreateUserDto> {
    return await this.userService.create(createUser);
  }
  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<UserEntity>> {
    return await this.userService.findAll(query);
  }
  @UseGuards(AuthGuard)
  @Get('/me/:token')
  async me(@Param('token') token: string): Promise<UserEntity | null> {
    return await this.userService.me(token);
  }
  @Post('/login')
  async login(@Body() logInData: LogInDto): Promise<string> {
    return await this.userService.login(logInData);
  }
}
