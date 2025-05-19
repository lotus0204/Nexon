import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Reward } from '../domain/reward.entity';
import { RewardCreateInput } from './dto/reward-create.input';
import { Event } from 'src/event/domain/event.entity';
import { RewardRequestStatus } from '../../reward-request/domain/reward-request-status.enum';
import { RewardRequest } from '../../reward-request/domain/reward-request.entity';
import { MongooseRewardRepository } from '../infra/mongoose-reward.repository';

@Injectable()
export class RewardService {
  constructor(
    private readonly rewardRepository: MongooseRewardRepository,
  ) {}

  async createReward(input: RewardCreateInput): Promise<{ reward: Reward; event: Event }> {
    return await this.rewardRepository.save(input);
  }

  async getRewardById(id: string): Promise<{
    reward: Reward;
    event: Event;
  }> {
    const reward = await this.rewardRepository.findById(id);
    if (!reward) throw new NotFoundException('보상을 찾을 수 없습니다.');
    return reward;
  }

  async deleteRewardById(id: string): Promise<void> {
    const reward = await this.rewardRepository.findById(id);
    if (!reward) throw new NotFoundException('보상을 찾을 수 없습니다.');
    await this.rewardRepository.deleteById(id);
  }
} 