import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { RewardType } from '../../domain/reward.entity';

export class CreateRewardDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(RewardType)
  type: RewardType;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  eventId: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
} 