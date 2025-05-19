import { Module } from '@nestjs/common';
import { GatewayAuthController } from './auth-proxy/gateway.controller';
import { JwtStrategy } from './common/guards/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { GatewayEventController } from './event-proxy/gateway-event.controller';
import { GatewayRewardController } from './event-proxy/gateway-reward.controller';
import { GatewayRewardRequestController } from './event-proxy/gateway-reward-request.controller';
import { GatewayUserEventProgressController } from './event-proxy/gateway-user-event-progress.controller';

@Module({
  controllers: [
    GatewayAuthController,
    GatewayEventController,
    GatewayRewardController,
    GatewayRewardRequestController,
    GatewayUserEventProgressController,
  ],
  imports: [
    ConfigModule.forRoot(),
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'mySuperSecretKey123!@',
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') || '1h' },
      }),
    }),
  ],
  providers: [{
    provide: APP_GUARD,
    useClass: JwtAuthGuard, // 먼저 등록!
  },JwtStrategy, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class GatewayModule {}
