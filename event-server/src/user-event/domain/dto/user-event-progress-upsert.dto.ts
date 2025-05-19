import { EventType } from '../../../event/domain/event-type.enum';

export class UserEventProgressUpsertDto {
  userId: string;
  eventId: string;
  eventType: EventType;
  attendanceDays?: number;
  invitedFriends?: number;
  firstJoinedAt?: Date;
} 