import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardService } from './application/reward.service';
import { MongooseRewardRepository } from './infra/mongoose-reward.repository';
import { Reward, RewardSchema } from './domain/reward.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reward.name, schema: RewardSchema },
    ]),
  ],
  providers: [RewardService, MongooseRewardRepository],
  exports: [RewardService],
})
export class RewardModule {} 