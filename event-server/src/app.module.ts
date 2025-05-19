import { Module } from '@nestjs/common';
import { EventController } from './event/presentation/event.controller';
import { EventModule } from './event/event.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { RewardModule } from './reward/reward.module';
import { RewardController } from './reward/presentation/reward.controller';
import { RewardRequestModule } from './reward-request/reward-request.module';
import { RewardRequestController } from './reward-request/presentation/reward-request.controller';
import { UserEventProgressController } from './user-event/presentation/user-event-progress.controller';
import { UserEventModule } from './user-event/user-event.module';

@Module({
  imports: [
    EventModule,
    RewardModule,
    RewardRequestModule,
    UserEventModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://mongo-event:27017/event'),
  ],
  controllers: [EventController, RewardController, RewardRequestController, UserEventProgressController],
  providers: [],
})
export class AppModule {}
