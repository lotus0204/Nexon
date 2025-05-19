import { EventStatus } from "../../domain/event.entity";
import { EventCondition, EventType } from '../../domain/event-type.enum';

export class EventCreateInput<T extends EventType = EventType> {
  name: string;
  description: string;
  startAt: Date;
  endAt: Date;
  type: T;
  condition: EventCondition<T>;
  status: EventStatus;

  constructor(init: Partial<EventCreateInput<T>>) {
    Object.assign(this, init);
    this.status = init.status ?? EventStatus.DISABLED;
  }
} 