import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { RewardRequestService } from '../application/reward-request.service';
import { CreateRewardRequestDto } from './dto/create-reward-request.dto';
import { RewardRequestCreateInput } from '../application/dto/reward-request-create.input';
import { RewardRequestStatus } from '../domain/reward-request-status.enum';
import { RewardRequestSearchCriteriaInput } from '../application/dto/reward-request-search-criteria.input';
import { RewardRequestResponseDto } from './dto/reward-request-response.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('reward-requests')
@Controller('reward-requests')
export class RewardRequestController {
  constructor(private readonly rewardRequestService: RewardRequestService) {}

  @ApiOperation({ summary: '보상 요청 생성' })
  @ApiResponse({ status: 201, description: '보상 요청 생성 성공', type: RewardRequestResponseDto })
  @ApiBody({
    type: CreateRewardRequestDto,
    examples: {
      default: {
        summary: '보상 요청 예시',
        value: {
          userId: '682b31fbc26f97c76ad04fe8',
          eventId: '682b385f3d379f68cb90ee64',
          rewardId: '682b3ab1b72276ef6e8463a6'
        }
      }
    }
  })
  @Post()
  async create(@Body() dto: CreateRewardRequestDto): Promise<RewardRequestResponseDto> {
    const input = new RewardRequestCreateInput(dto);
    const request = await this.rewardRequestService.create(input);
    return RewardRequestResponseDto.fromEntity(request);
  }

  @ApiOperation({ summary: '특정 유저의 보상 요청 목록 조회' })
  @ApiResponse({ status: 200, description: '보상 요청 목록', type: [RewardRequestResponseDto] })
  @ApiParam({ name: 'userId', description: '유저 ID', example: 'user123' })
  @Get('user/:userId')
  async getByUserId(@Param('userId') userId: string): Promise<RewardRequestResponseDto[]> {
    const requests = await this.rewardRequestService.getByUserId(userId);
    return requests.map(r => RewardRequestResponseDto.fromEntity(r));
  }

  @ApiOperation({ summary: '보상 요청 목록 검색' })
  @ApiResponse({ status: 200, description: '보상 요청 목록', type: [RewardRequestResponseDto] })
  @ApiQuery({ name: 'userId', required: false, description: '유저 ID', example: 'user123' })
  @ApiQuery({ name: 'eventId', required: false, description: '이벤트 ID', example: 'event456' })
  @ApiQuery({ name: 'status', required: false, description: '요청 상태', enum: RewardRequestStatus, example: 'SUCCESS' })
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