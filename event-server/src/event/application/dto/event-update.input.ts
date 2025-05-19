import { EventCondition, EventType } from '../../domain/event-type.enum';
import { EventStatus } from '../../domain/event.entity';

export class EventUpdateInput<T extends EventType = EventType> {
  id: string;
  name?: string;
  description?: string;
  startAt?: Date;
  endAt?: Date;
  type?: T;
  condition?: EventCondition<T>;
  status?: EventStatus;

  constructor(init: Partial<EventUpdateInput<T>>) {
    Object.assign(this, init);
  }
} 