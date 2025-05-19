import { IsEnum } from 'class-validator';
import { UserRole } from '../../domain/user.schema';

export class UpdateRoleDto {
  @IsEnum(UserRole, { message: '올바른 역할이 아닙니다.' })
  role: UserRole;
} 