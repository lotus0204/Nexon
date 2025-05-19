import { RewardRequestStatus } from '../../domain/reward-request-status.enum';

export class RewardRequestCreateInput {
  userId: string;
  eventId: string;
  rewardId: string;
  processedAt?: Date;

  constructor(init: Partial<RewardRequestCreateInput>) {
    Object.assign(this, init);
  }
} 