import { Module } from '@nestjs/common';
import { GatewayModule } from './gateway.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './common/guards/jwt.strategy';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),GatewayModule, PassportModule.register({ defaultStrategy: 'jwt' }), JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      secret: config.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') || '1h' },
    }),
  })],
  providers: [JwtStrategy]
})
export class AppModule {}