import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { RewardService } from '../application/reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { RewardCreateInput } from '../application/dto/reward-create.input';
import { RewardResponseDto } from './dto/reward-response.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('rewards')
@Controller('rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @ApiOperation({ summary: '보상 생성' })
  @ApiResponse({ status: 201, description: '보상 생성 성공', type: RewardResponseDto })
  @ApiBody({
    type: CreateRewardDto,
    examples: {
      item: {
        summary: '아이템 보상',
        value: {
          name: '고급 무기 상자',
          description: '랜덤 고급 무기 지급',
          type: 'ITEM',
          amount: 1,
          eventId: '682b385f3d379f68cb90ee64',
          imageUrl: 'https://example.com/item.png'
        }
      },
      currency: {
        summary: '게임머니 보상',
        value: {
          name: '골드 지급',
          description: '이벤트 참여 보상 골드',
          type: 'CURRENCY',
          amount: 10000,
          eventId: '682b38c93d379f68cb90ee66',
          imageUrl: 'https://example.com/gold.png'
        }
      },
      point: {
        summary: '포인트 보상',
        value: {
          name: '이벤트 포인트',
          description: '이벤트 전용 포인트 지급',
          type: 'POINT',
          amount: 50,
          eventId: '682b38d23d379f68cb90ee68'
        }
      },
      coupon: {
        summary: '쿠폰 보상',
        value: {
          name: '10% 할인 쿠폰',
          description: '상점 10% 할인 쿠폰',
          type: 'COUPON',
          eventId: '682b38df3d379f68cb90ee6a',
          imageUrl: 'https://example.com/coupon.png'
        }
      }
    }
  })
  @Post()
  async create(@Body() dto: CreateRewardDto): Promise<RewardResponseDto> {
    const input = new RewardCreateInput(dto);
    const { reward, event } = await this.rewardService.createReward(input);
    return RewardResponseDto.fromEntity(reward, event);
  }

  @ApiOperation({ summary: '보상 단건 조회' })
  @ApiResponse({
    status: 200,
    description: '보상 단건 조회 성공',
    type: RewardResponseDto,
    schema: {
      example: {
        id: 'reward789',
        name: '고급 무기 상자',
        description: '랜덤 고급 무기 지급',
        type: 'ITEM',
        amount: 1,
        imageUrl: 'https://example.com/item.png',
        event: {
          id: 'event456',
          name: '출석 이벤트',
          description: '7일 연속 출석 시 보상 지급',
          startAt: '2024-07-01T00:00:00.000Z',
          endAt: '2024-07-31T23:59:59.999Z',
          type: 'ATTENDANCE',
          condition: { requiredDays: 7 },
          status: 'ENABLED'
        }
      }
    }
  })
  @ApiParam({ name: 'id', description: '보상 ID', example: 'reward789' })
  @Get(':id')
  async getById(@Param('id') id: string): Promise<RewardResponseDto> {
    const { reward, event } = await this.rewardService.getRewardById(id);
    return RewardResponseDto.fromEntity(reward, event);
  }

  @ApiOperation({ summary: '보상 삭제' })
  @ApiResponse({ status: 200, description: '보상 삭제 성공', schema: { example: null } })
  @ApiParam({ name: 'id', description: '보상 ID', example: 'reward789' })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.rewardService.deleteRewardById(id);
  }
} 