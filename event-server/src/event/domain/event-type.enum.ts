export enum EventType {
  NEW_USER = 'NEW_USER',
  SPECIAL_DATE = 'SPECIAL_DATE',
  ATTENDANCE = 'ATTENDANCE',
  FRIEND_INVITE = 'FRIEND_INVITE',
  // 필요시 추가 이벤트 타입
} 

export type NewUserCondition = { newUserWithinDays: number };
export type SpecialDateCondition = { specialDateRange: { from: string; to: string } };
export type AttendanceCondition = { requiredDays: number };
export type FriendInviteCondition = { minInvites: number };

export type EventConditionMap = {
  [EventType.NEW_USER]: NewUserCondition;
  [EventType.SPECIAL_DATE]: SpecialDateCondition;
  [EventType.ATTENDANCE]: AttendanceCondition;
  [EventType.FRIEND_INVITE]: FriendInviteCondition;
};
export type EventCondition<T extends EventType> = EventConditionMap[T];