import { RewardRequestStatus } from '../../domain/reward-request-status.enum';

export class RewardRequestUpdateInput {
  id: string;
  status?: RewardRequestStatus;
  processedAt?: Date;
  reason?: string;

  constructor(init: Partial<RewardRequestUpdateInput>) {
    Object.assign(this, init);
  }
} 