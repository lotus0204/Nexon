import { RewardType } from '../../domain/reward.entity';

export class RewardCreateInput {
  name: string;
  description?: string;
  type: RewardType;
  amount?: number;
  eventId: string;
  imageUrl?: string;

  constructor(init: Partial<RewardCreateInput>) {
    Object.assign(this, init);
  }
} 