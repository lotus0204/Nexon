export class UserEventProgressCriteria {
  userId?: string;
  eventId?: string;

  constructor(init?: Partial<UserEventProgressCriteria>) {
    Object.assign(this, init);
  }
} 