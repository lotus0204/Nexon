import { Injectable, ForbiddenException } from '@nestjs/common';
import { EventType, EventCondition } from '../event/domain/event-type.enum';
import { UserEventProgress } from 'src/user-event/domain/user-event-progress.entity';
import { RewardRequestStatus } from '../reward-request/domain/reward-request-status.enum';

export class EventConditionValidateInputDto {
  eventType!: EventType;
  condition!: EventCondition<any>;
  progress!: UserEventProgress;
}

// 1. 각 조건별 validator 인터페이스
export interface ConditionHandler<T extends EventType> {
  supports(eventType: EventType): boolean;
  validate(condition: EventCondition<T>, progress: UserEventProgress): RewardRequestStatus;
}

// 신규유저(계정 생성일로부터 7일 이내) 조건 핸들러
export class NewUserConditionHandler implements ConditionHandler<EventType.NEW_USER> {
  supports(eventType: EventType) {
    return eventType === EventType.NEW_USER;
  }
  validate(condition: EventCondition<EventType.NEW_USER>, progress: UserEventProgress) {
    if (!progress.firstJoinedAt) {
      throw new ForbiddenException('유저의 계정 생성일 정보가 없습니다.');
    }
    const now = new Date();
    const diffDays = (now.getTime() - progress.firstJoinedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > condition.newUserWithinDays) {
      throw new ForbiddenException(`계정 생성일로부터 ${condition.newUserWithinDays}일 이내 유저만 참여 가능합니다.`);
    }
    return RewardRequestStatus.SUCCESS;
  }
}

// 연속 출석(ATTENDANCE) 조건 핸들러
export class AttendanceConditionHandler implements ConditionHandler<EventType.ATTENDANCE> {
  supports(eventType: EventType) {
    return eventType === EventType.ATTENDANCE;
  }
  validate(condition: EventCondition<EventType.ATTENDANCE>, progress: UserEventProgress) {
    if (typeof progress.attendanceDays !== 'number') {
      throw new ForbiddenException('유저의 연속 출석 일수 정보가 없습니다.');
    }
    if (progress.attendanceDays < condition.requiredDays) {
      throw new ForbiddenException(`연속 ${condition.requiredDays}일 출석해야 참여 가능합니다.`);
    }
    return RewardRequestStatus.SUCCESS;
  }
}

// 친구초대(FRIEND_INVITE) 조건 핸들러
export class FriendInviteConditionHandler implements ConditionHandler<EventType.FRIEND_INVITE> {
  supports(eventType: EventType) {
    return eventType === EventType.FRIEND_INVITE;
  }
  validate(condition: EventCondition<EventType.FRIEND_INVITE>, progress: UserEventProgress) {
    if (typeof progress.invitedFriends !== 'number') {
      throw new ForbiddenException('유저의 초대한 친구 수 정보가 없습니다.');
    }
    if (progress.invitedFriends < condition.minInvites) {
      throw new ForbiddenException(`최소 ${condition.minInvites}명 친구를 초대해야 참여 가능합니다.`);
    }
    return RewardRequestStatus.SUCCESS;
  }
}

// 특별날짜(SPECIAL_DATE) 조건 핸들러
export class SpecialDateConditionHandler implements ConditionHandler<EventType.SPECIAL_DATE> {
  supports(eventType: EventType) {
    return eventType === EventType.SPECIAL_DATE;
  }
  validate(condition: EventCondition<EventType.SPECIAL_DATE>, progress: UserEventProgress) {
    if (!condition.specialDateRange || !condition.specialDateRange.from || !condition.specialDateRange.to) {
      throw new ForbiddenException('이벤트의 날짜 범위 정보가 올바르지 않습니다.');
    }
    const now = new Date();
    const from = new Date(condition.specialDateRange.from);
    const to = new Date(condition.specialDateRange.to);
    console.log('now', now);
    console.log('from', from);
    console.log('to', to);
    if (now < from || now > to) {
      throw new ForbiddenException(
        `이 이벤트는 ${condition.specialDateRange.from} ~ ${condition.specialDateRange.to} 기간에만 참여 가능합니다.`
      );
    }
    return RewardRequestStatus.SUCCESS;
  }
}

// 5. ConditionValidatorService에서 핸들러 배열 관리
@Injectable()
export class EventConditionValidateManager {
  private handlers: ConditionHandler<any>[] = [
    new NewUserConditionHandler(),
    new AttendanceConditionHandler(),
    new FriendInviteConditionHandler(),
    new SpecialDateConditionHandler(),
  ];

  /**
   * 이벤트의 condition과 유저 정보를 받아 조건 충족 여부를 검사
   * @param inputDto 이벤트 조건 검증에 필요한 모든 정보가 담긴 DTO
   * @throws ForbiddenException 조건 불충족 시
   */
  validate(inputDto: EventConditionValidateInputDto): RewardRequestStatus {
    const { eventType, condition, progress } = inputDto;
    if (!condition) throw new ForbiddenException('이벤트 조건이 존재하지 않습니다.');
    
    for (const handler of this.handlers) {
      if (handler.supports(eventType)) {
        return handler.validate(condition, progress);
      }
    }
    throw new ForbiddenException('이벤트 조건을 찾을 수 없습니다.');
  }
} 