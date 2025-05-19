import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/auth.controller';
import { JwtStrategy } from './application/jwt.strategy';
import { UserModule, userRepository } from '../users/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'mySuperSecretKey123!@',
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') || '1h' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, userRepository],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {} 