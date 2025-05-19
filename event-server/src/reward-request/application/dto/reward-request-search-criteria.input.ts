import { RewardRequestStatus } from '../../domain/reward-request-status.enum';

export class RewardRequestSearchCriteriaInput {
  userId?: string;
  eventId?: string;
  status?: RewardRequestStatus;
  // 필요시 기간, rewardId 등 추가 가능
} 