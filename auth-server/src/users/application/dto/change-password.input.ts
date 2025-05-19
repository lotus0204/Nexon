export class ChangePasswordInput {
  mapleId: string;
  oldPassword: string;
  newPassword: string;

  constructor(init: { mapleId: string; oldPassword: string; newPassword: string }) {
    this.mapleId = init.mapleId;
    this.oldPassword = init.oldPassword;
    this.newPassword = init.newPassword;
  }
} 