export class UserCreateInput {
  nexonId: string;
  mapleId: string;
  secondPassword: string;

  constructor(partial: Partial<UserCreateInput>) {
    Object.assign(this, partial);
  }
} 