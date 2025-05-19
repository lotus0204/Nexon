import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardRequestService } from './application/reward-request.service';
import { MongooseRewardRequestRepository } from './infra/mongoose-reward-request.repository';
import { RewardRequest, RewardRequestSchema } from './domain/reward-request.entity';
import { EventModule } from 'src/event/event.module';
import { UserEventModule } from 'src/user-event/user-event.module';
import { EventConditionValidateManagerModule } from 'src/event-condition-validate-manager/event-condition-validate-manager.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardRequest.name, schema: RewardRequestSchema },
    ]),
    EventModule,
    UserEventModule,
    EventConditionValidateManagerModule
  ],
  providers: [RewardRequestService, MongooseRewardRequestRepository],
  exports: [RewardRequestService],
})
export class RewardRequestModule {} 