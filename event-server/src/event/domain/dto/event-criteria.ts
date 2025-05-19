import { EventStatus } from '../event.entity';
import { EventCondition, EventType } from '../event-type.enum';

export class EventCriteria<T extends EventType = EventType> {
  name?: string;
  status?: EventStatus;
  type?: T;
  startAtFrom?: Date;
  startAtTo?: Date;
  condition?: EventCondition<T>;

  constructor(init: Partial<EventCriteria<T>>) {
    Object.assign(this, init);
  }
}   