import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from 'src/user/model/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userRepository: UserRepository,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization;
    if (!token) {
      return false;
    } else {
      try {
        const payload = jwt.verify(token, 'JWT_SECRET_KEY') as jwt.JwtPayload;
        const user = await this.userRepository.findOne({
          where: { id: payload.id },
        });
        if (!user) {
          return false;
        }
        return true;
      } catch (error) {
        return false;
      }
    }
  }
}
