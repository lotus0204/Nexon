export class DeleteUserInput {
  mapleId: string;
  password: string;

  constructor(init: { mapleId: string; password: string }) {
    this.mapleId = init.mapleId;
    this.password = init.password;
  }
} 