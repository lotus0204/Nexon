import { EventType } from "src/event/domain/event-type.enum";
import { EventStatus } from "../../domain/event.entity";

export class EventQueryInput {
  name?: string;
  status?: EventStatus;
  type?: EventType;
  startAtFrom?: Date;
  startAtTo?: Date;

  constructor(init: Partial<EventQueryInput>) {
    Object.assign(this, init);
  }
} 