import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../users/domain/user.repository';
import { User, UserRole } from '../../users/domain/user.schema';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { LoginInput } from './dto/login.input';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    userRepository = {
      findByMapleId: jest.fn(),
    } as any;

    jwtService = {
      sign: jest.fn(),
    } as any;

    authService = new AuthService(userRepository, jwtService);
  });

  it('로그인에 성공하면 accessToken을 반환한다', async () => {
    const input = new LoginInput({ mapleId: 'testuser', secondPassword: 'pw1234' });
    const user = new User({ mapleId: 'testuser', secondPassword: 'hashed', role: UserRole.USER, nexonId: 'nexon1' });

    userRepository.findByMapleId.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.sign.mockReturnValue('mocked.jwt.token');

    const result = await authService.login(input);

    expect(result).toEqual({ accessToken: 'mocked.jwt.token' });
    expect(userRepository.findByMapleId).toHaveBeenCalledWith('testuser');
    expect(jwtService.sign).toHaveBeenCalledWith({ sub: 'testuser', role: UserRole.USER });
  });

  it('유저가 존재하지 않으면 UnauthorizedException을 던진다', async () => {
    const input = new LoginInput({ mapleId: 'notfound', secondPassword: 'pw1234' });
    userRepository.findByMapleId.mockResolvedValue(null);

    await expect(authService.login(input)).rejects.toThrow(UnauthorizedException);
  });

  it('비밀번호가 일치하지 않으면 UnauthorizedException을 던진다', async () => {
    const input = new LoginInput({ mapleId: 'testuser', secondPassword: 'wrongpw' });
    const user = new User({ mapleId: 'testuser', secondPassword: 'hashed', role: UserRole.USER, nexonId: 'nexon1' });

    userRepository.findByMapleId.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(authService.login(input)).rejects.toThrow(UnauthorizedException);
  });
});