import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserCreateInput } from '../application/dto/user-create.input';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateRoleInput } from '../application/dto/update-role.input';
import { UserResponse } from './response/user.response';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangePasswordInput } from '../application/dto/change-password.input';
import { DeleteUserDto } from './dto/delete-user.dto';
import { DeleteUserInput } from '../application/dto/delete-user.input';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 201, description: '회원가입 성공', type: UserResponse })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      default: {
        summary: '회원가입 예시',
        value: {
          nexonId: 'nexon1234',
          mapleId: 'mapleuser01',
          secondPassword: 'passw0rd',
        },
      },
    },
  })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    const user = await this.usersService.register(new UserCreateInput(createUserDto));
    return new UserResponse(user);
  }

  @ApiOperation({ summary: '권한 변경' })
  @ApiResponse({ status: 200, description: '권한 변경 성공', type: UserResponse })
  @ApiParam({ name: 'mapleId', description: '유저의 mapleId' })
  @ApiBody({
    type: UpdateRoleDto,
    examples: {
      default: {
        summary: '권한 변경 예시',
        value: {
          role: 'ADMIN',
        },
      },
    },
  })
  @Patch(':mapleId/role')
  async updateRole(@Param('mapleId') mapleId: string, @Body() dto: UpdateRoleDto): Promise<UserResponse> {
    const user = await this.usersService.updateRole(new UpdateRoleInput({ mapleId, role: dto.role }));
    return new UserResponse(user);
  }

  @ApiOperation({ summary: '비밀번호 변경' })
  @ApiResponse({ status: 200, description: '비밀번호 변경 성공', type: UserResponse })
  @ApiParam({ name: 'mapleId', description: '유저의 mapleId' })
  @ApiBody({
    type: ChangePasswordDto,
    examples: {
      default: {
        summary: '비밀번호 변경 예시',
        value: {
          oldPassword: 'passw0rd',
          newPassword: 'newpass123',
        },
      },
    },
  })
  @Patch(':mapleId/password')
  async changePassword(@Param('mapleId') mapleId: string, @Body() dto: ChangePasswordDto): Promise<UserResponse> {
    const user = await this.usersService.changePassword(
      new ChangePasswordInput({ mapleId, oldPassword: dto.oldPassword, newPassword: dto.newPassword })
    );
    return new UserResponse(user);
  }

  @ApiOperation({ summary: '회원 삭제' })
  @ApiResponse({ status: 200, description: '회원 삭제 성공', schema: { example: { success: true } } })
  @ApiParam({ name: 'mapleId', description: '유저의 mapleId' })
  @ApiBody({
    type: DeleteUserDto,
    examples: {
      default: {
        summary: '회원 삭제 예시',
        value: {
          password: 'passw0rd',
        },
      },
    },
  })
  @Delete(':mapleId')
  async deleteUser(
    @Param('mapleId') mapleId: string,
    @Body() dto: DeleteUserDto,
  ): Promise<{ success: boolean }> {
    await this.usersService.deleteUser(
      new DeleteUserInput({ mapleId, password: dto.password })
    );
    return { success: true };
  }
} 