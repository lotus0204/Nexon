import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/domain/user.schema';
import { UserRepository } from '../../users/domain/user.repository';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(mapleId: string, secondPassword: string): Promise<User | null> {
    const user = await this.userRepository.findByMapleId(mapleId);
    if (user && await bcrypt.compare(secondPassword, user.secondPassword)) {
      return user;
    }
    return null;
  }

  async login(input: LoginInput): Promise<{ accessToken: string }> {
    const user = await this.validateUser(input.mapleId, input.secondPassword);
    if (!user) throw new UnauthorizedException('로그인 정보가 올바르지 않습니다.');

    const payload = { sub: user.mapleId, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
} 