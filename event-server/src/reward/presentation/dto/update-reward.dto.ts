import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { RewardType } from '../../domain/reward.entity';

export class UpdateRewardDto {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(RewardType)
  @IsOptional()
  type?: RewardType;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  eventId?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
} 