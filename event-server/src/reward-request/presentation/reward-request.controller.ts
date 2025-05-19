import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { RewardRequestService } from '../application/reward-request.service';
import { CreateRewardRequestDto } from './dto/create-reward-request.dto';
import { RewardRequestCreateInput } from '../application/dto/reward-request-create.input';
import { RewardRequestStatus } from '../domain/reward-request-status.enum';
import { RewardRequestSearchCriteriaInput } from '../application/dto/reward-request-search-criteria.input';
import { RewardRequestResponseDto } from './dto/reward-request-response.dto';

@Controller('reward-requests')
export class RewardRequestController {
  constructor(private readonly rewardRequestService: RewardRequestService) {}

  @Post()
  async create(@Body() dto: CreateRewardRequestDto): Promise<RewardRequestResponseDto> {
    const input = new RewardRequestCreateInput(dto);
    const request = await this.rewardRequestService.create(input);
    return RewardRequestResponseDto.fromEntity(request);
  }

  @Get('user/:userId')
  async getByUserId(@Param('userId') userId: string): Promise<RewardRequestResponseDto[]> {
    const requests = await this.rewardRequestService.getByUserId(userId);
    return requests.map(r => RewardRequestResponseDto.fromEntity(r));
  }

  @Get()
  async getList(
    @Query('userId') userId?: string,
    @Query('eventId') eventId?: string,
    @Query('status') status?: RewardRequestStatus,
  ): Promise<RewardRequestResponseDto[]> {
    const criteria: RewardRequestSearchCriteriaInput = {
      userId,
      eventId,
      status,
    };
    const requests = await this.rewardRequestService.getListByCriteria(criteria);
    return requests.map(r => RewardRequestResponseDto.fromEntity(r));
  }
} 