import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LoginInput } from '../application/dto/login.input';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: 201,
    description: '로그인 성공',
    type: Object,
  })
  @ApiBody({
    type: LoginDto,
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(new LoginInput(loginDto));
  }
}