import { EventConditionValidateManager, EventConditionValidateInputDto, ConditionValidateResult } from './event-condition-validate.manager';
import { EventType, EventCondition } from '../event/domain/event-type.enum';
import { UserEventProgress } from 'src/user-event/domain/user-event-progress.entity';
import { RewardRequestStatus } from '../reward-request/domain/reward-request-status.enum';

describe('EventConditionValidateManager', () => {
  let manager: EventConditionValidateManager;

  beforeEach(() => {
    manager = new EventConditionValidateManager();
  });

  it('신규유저 조건: 정상 통과', () => {
    const dto: EventConditionValidateInputDto = {
      eventType: EventType.NEW_USER,
      condition: { newUserWithinDays: 7 } as EventCondition<EventType.NEW_USER>,
      progress: { firstJoinedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) } as UserEventProgress,
    };
    const result = manager.validate(dto);
    expect(result.status).toBe(RewardRequestStatus.SUCCESS);
    expect(result.reason).toBeUndefined();
  });

  it('신규유저 조건: 기간 초과 실패', () => {
    const dto: EventConditionValidateInputDto = {
      eventType: EventType.NEW_USER,
      condition: { newUserWithinDays: 7 } as EventCondition<EventType.NEW_USER>,
      progress: { firstJoinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) } as UserEventProgress,
    };
    const result = manager.validate(dto);
    expect(result.status).toBe(RewardRequestStatus.FAIL);
    expect(result.reason).toContain('계정 생성일로부터');
  });

  it('연속 출석 조건: 정상 통과', () => {
    const dto: EventConditionValidateInputDto = {
      eventType: EventType.ATTENDANCE,
      condition: { requiredDays: 3 } as EventCondition<EventType.ATTENDANCE>,
      progress: { attendanceDays: 5 } as UserEventProgress,
    };
    const result = manager.validate(dto);
    expect(result.status).toBe(RewardRequestStatus.SUCCESS);
    expect(result.reason).toBeUndefined();
  });

  it('연속 출석 조건: 출석 일수 부족 실패', () => {
    const dto: EventConditionValidateInputDto = {
      eventType: EventType.ATTENDANCE,
      condition: { requiredDays: 5 } as EventCondition<EventType.ATTENDANCE>,
      progress: { attendanceDays: 2 } as UserEventProgress,
    };
    const result = manager.validate(dto);
    expect(result.status).toBe(RewardRequestStatus.FAIL);
    expect(result.reason).toContain('연속');
  });

  it('친구초대 조건: 정상 통과', () => {
    const dto: EventConditionValidateInputDto = {
      eventType: EventType.FRIEND_INVITE,
      condition: { minInvites: 2 } as EventCondition<EventType.FRIEND_INVITE>,
      progress: { invitedFriends: 3 } as UserEventProgress,
    };
    const result = manager.validate(dto);
    expect(result.status).toBe(RewardRequestStatus.SUCCESS);
    expect(result.reason).toBeUndefined();
  });

  it('친구초대 조건: 초대한 친구 수 부족 실패', () => {
    const dto: EventConditionValidateInputDto = {
      eventType: EventType.FRIEND_INVITE,
      condition: { minInvites: 2 } as EventCondition<EventType.FRIEND_INVITE>,
      progress: { invitedFriends: 1 } as UserEventProgress,
    };
    const result = manager.validate(dto);
    expect(result.status).toBe(RewardRequestStatus.FAIL);
    expect(result.reason).toContain('최소');
  });

  it('특별날짜 조건: 정상 통과', () => {
    const now = new Date();
    const dto: EventConditionValidateInputDto = {
      eventType: EventType.SPECIAL_DATE,
      condition: {
        specialDateRange: {
          from: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
          to: new Date(now.getTime() + 1000 * 60 * 60 * 24).toISOString(),
        },
      } as EventCondition<EventType.SPECIAL_DATE>,
      progress: {} as UserEventProgress,
    };
    const result = manager.validate(dto);
    expect(result.status).toBe(RewardRequestStatus.SUCCESS);
    expect(result.reason).toBeUndefined();
  });

  it('특별날짜 조건: 기간 외 실패', () => {
    const now = new Date();
    const dto: EventConditionValidateInputDto = {
      eventType: EventType.SPECIAL_DATE,
      condition: {
        specialDateRange: {
          from: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10).toISOString(),
          to: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        },
      } as EventCondition<EventType.SPECIAL_DATE>,
      progress: {} as UserEventProgress,
    };
    const result = manager.validate(dto);
    expect(result.status).toBe(RewardRequestStatus.FAIL);
    expect(result.reason).toContain('기간에만 참여 가능합니다');
  });
}); 