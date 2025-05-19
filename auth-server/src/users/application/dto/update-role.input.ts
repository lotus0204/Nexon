import { UserRole } from '../../domain/user.schema';

export class UpdateRoleInput {
  mapleId: string;
  role: UserRole;

  constructor(init: { mapleId: string; role: UserRole }) {
    this.mapleId = init.mapleId;
    this.role = init.role;
  }
} 