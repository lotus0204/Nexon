import { RewardRequest } from '../../domain/reward-request.entity';

export class RewardRequestResponseDto {
  id: string;
  userId: string;
  eventId: string;
  rewardId: string;
  status: string;
  requestedAt: string;
  processedAt?: string;
  reason?: string;

  constructor(request: RewardRequest) {
    this.id = request._id?.toString?.() ?? request.id;
    this.userId = request.userId;
    this.eventId = request.eventId;
    this.rewardId = request.rewardId;
    this.status = request.status;
    this.requestedAt = request.requestedAt instanceof Date ? request.requestedAt.toISOString() : request.requestedAt;
    this.processedAt = request.processedAt ? (request.processedAt instanceof Date ? request.processedAt.toISOString() : request.processedAt) : undefined;
    this.reason = request.reason;
  }

  static fromEntity(request: RewardRequest) {
    return new RewardRequestResponseDto(request);
  }
} 