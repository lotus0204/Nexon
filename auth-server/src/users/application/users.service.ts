import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../domain/user.schema';
import { UserCreateInput } from './dto/user-create.input';
import { UserRepository } from '../domain/user.repository';
import { UpdateRoleInput } from './dto/update-role.input';
import { ChangePasswordInput } from './dto/change-password.input';
import { DeleteUserInput } from './dto/delete-user.input';


@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: UserRepository,
  ) {}

  async register(input: UserCreateInput): Promise<User> {
    const { nexonId, mapleId, secondPassword } = input;

    const exists = await this.userRepository.findByMapleId(mapleId);
    if (exists) {
      throw new BadRequestException('이미 사용 중인 메이플ID입니다.');
    }

    const hash = await bcrypt.hash(secondPassword, 10);

    const user = new User({
      nexonId,
      mapleId,
      secondPassword: hash,
    });

    await this.userRepository.save(user);

    return user;
  }

  async updateRole(input: UpdateRoleInput): Promise<User> {
    const { mapleId, role } = input;
    const user = await this.userRepository.findByMapleId(mapleId);
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');
    
    user.role = role;
    await this.userRepository.save(user);

    return user;
  }

  async changePassword(input: ChangePasswordInput): Promise<User> {
    const { mapleId, oldPassword, newPassword } = input;
    const user = await this.userRepository.findByMapleId(mapleId);
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');
  
    const isMatch = await bcrypt.compare(oldPassword, user.secondPassword);
    if (!isMatch) throw new BadRequestException('기존 비밀번호가 일치하지 않습니다.');
  
    user.secondPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
  
    return user;
  }

  async deleteUser(input: DeleteUserInput): Promise<void> {
    const { mapleId, password } = input;
    const user = await this.userRepository.findByMapleId(mapleId);
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');

    const isMatch = await bcrypt.compare(password, user.secondPassword);
    if (!isMatch) throw new BadRequestException('비밀번호가 일치하지 않습니다.');

    await this.userRepository.deleteByMapleId(mapleId);
  }
} 