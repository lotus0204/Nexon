import { IsString, IsOptional, IsEnum } from 'class-validator';
import { RewardRequestStatus } from '../../domain/reward-request-status.enum';

export class CreateRewardRequestDto {
  @IsString()
  userId: string;

  @IsString()
  eventId: string;

  @IsString()
  rewardId: string;

  // @IsEnum(RewardRequestStatus)
  // @IsOptional()
  // status?: RewardRequestStatus;

  // @IsString()
  // @IsOptional()
  // reason?: string;
} 