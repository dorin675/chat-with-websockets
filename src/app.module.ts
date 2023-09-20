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
      url: 'postgres://postgres_u4ks_user:cOjG14pKElZC2t5iT6jCkSOhRN6uvul0@dpg-ck5a54mg2bec73ceqoi0-a/postgres_u4ks',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
