import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: '넥슨 계정(nexonId)은 필수입니다.' })
  nexonId: string;

  @IsString()
  @IsNotEmpty({ message: '메이플ID는 필수입니다.' })
  @Length(4, 20, { message: '메이플ID는 4~20자여야 합니다.' })
  @Matches(/^[A-Za-z0-9]+$/, { message: '메이플ID는 영문과 숫자만 사용할 수 있습니다.' })
  mapleId: string;

  @IsString()
  @IsNotEmpty({ message: '2차 비밀번호는 필수입니다.' })
  @Length(6, 16, { message: '2차 비밀번호는 6~16자여야 합니다.' })
  @Matches(/^(?=.*\d)[A-Za-z0-9]+$/, { message: '2차 비밀번호는 영문과 숫자를 포함해야 하며, 숫자가 반드시 포함되어야 합니다.' })
  secondPassword: string;
} 