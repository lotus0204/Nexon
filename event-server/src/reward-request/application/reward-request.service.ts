import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { RewardRequest } from '../domain/reward-request.entity';
import { RewardRequestCreateInput } from './dto/reward-request-create.input';
import { EventConditionValidateManager } from '../../event-condition-validate-manager/event-condition-validate.manager';
import { MongooseUserEventProgressRepository } from '../../user-event/infra/mongoose-user-event-progress.repository';
import { RewardRequestSearchCriteriaInput } from './dto/reward-request-search-criteria.input';
import { MongooseEventRepository } from '../../event/infra/mongoose-event.repository';
import { MongooseRewardRequestRepository } from '../infra/mongoose-reward-request.repository';

@Injectable()
export class RewardRequestService {
  constructor(
    private readonly rewardRequestRepository: MongooseRewardRequestRepository,
    private readonly eventRepository: MongooseEventRepository,
    private readonly userEventProgressRepository: MongooseUserEventProgressRepository,
    private readonly conditionValidatorService: EventConditionValidateManager,
  ) {}

  async create(input: RewardRequestCreateInput): Promise<RewardRequest> {
    // // 중복 신청 방지
    const existing = await this.rewardRequestRepository.findAllByUserId(input.userId);
    const isDuplicate = existing.some(
      req => req.eventId === input.eventId && req.rewardId === input.rewardId
    );
    if (isDuplicate) {
      throw new ConflictException('이미 해당 이벤트/보상에 신청한 이력이 있습니다.');
    }

    const event = await this.eventRepository.findById(input.eventId);
    if (!event) throw new NotFoundException('이벤트가 존재하지 않습니다.');
    
    // // 유저의 이벤트 진행상황 조회
    const progress = await this.userEventProgressRepository.findByUserIdAndEventId({
      userId: input.userId,
      eventId: input.eventId,
    });
    
    if (!progress) {
      throw new NotFoundException('유저의 이벤트 진행상황이 존재하지 않습니다.');
    }

    // // 이벤트 조건 검증
    const requestStatus = this.conditionValidatorService.validate({
      eventType: event.type,
      condition: event.condition,
      progress,
    });

    // 정상 생성
    const request = await this.rewardRequestRepository.save({
      userId: input.userId,
      eventId: input.eventId,
      rewardId: input.rewardId,
      status: requestStatus,
      requestedAt: new Date(),
      processedAt: input.processedAt,
    });
    return request;
  }

  async getByUserId(userId: string): Promise<RewardRequest[]> {
    return this.rewardRequestRepository.findAllByUserId(userId);
  }

  async getListByCriteria(criteria: RewardRequestSearchCriteriaInput): Promise<RewardRequest[]> {
    return this.rewardRequestRepository.findAllByCriteria(criteria);
  }
} 