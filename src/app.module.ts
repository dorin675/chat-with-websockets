import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://postgres:your_password@localhost:5432/postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
