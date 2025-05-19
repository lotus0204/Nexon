import { IsString, IsOptional, IsEnum } from 'class-validator';
import { RewardRequestStatus } from '../../domain/reward-request-status.enum';

export class UpdateRewardRequestDto {
  @IsString()
  id: string;

  @IsEnum(RewardRequestStatus)
  @IsOptional()
  status?: RewardRequestStatus;

  @IsString()
  @IsOptional()
  reason?: string;
} 