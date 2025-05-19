import { LoginDto } from '../../presentation/dto/login.dto';

export class LoginInput {
  mapleId: string;
  secondPassword: string; 

  constructor(dto: LoginDto) {
    this.mapleId = dto.mapleId;
    this.secondPassword = dto.secondPassword;
  }
} 