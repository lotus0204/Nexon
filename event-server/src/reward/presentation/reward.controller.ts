import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { RewardService } from '../application/reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { RewardCreateInput } from '../application/dto/reward-create.input';
import { RewardResponseDto } from './dto/reward-response.dto';

@Controller('rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post()
  async create(@Body() dto: CreateRewardDto): Promise<RewardResponseDto> {
    const input = new RewardCreateInput(dto);
    const { reward, event } = await this.rewardService.createReward(input);
    return RewardResponseDto.fromEntity(reward, event);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<RewardResponseDto> {
    const { reward, event } = await this.rewardService.getRewardById(id);
    return RewardResponseDto.fromEntity(reward, event);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.rewardService.deleteRewardById(id);
  }
} 