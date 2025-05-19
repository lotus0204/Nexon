import { UserRole } from '../../domain/user.schema';
import { User } from '../../domain/user.schema';

export class UserResponse {
  mapleId: string;
  role: UserRole;

  constructor(user: User) {
    this.mapleId = user.mapleId;
    this.role = user.role;
  }
} 