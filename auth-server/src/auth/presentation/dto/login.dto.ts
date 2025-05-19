import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: '메이플ID는 필수입니다.' })
  mapleId: string;

  @IsString()
  @IsNotEmpty({ message: '2차 비밀번호는 필수입니다.' })
  secondPassword: string;
} 