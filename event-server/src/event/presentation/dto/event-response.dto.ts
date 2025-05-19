import { EventCondition, EventType } from 'src/event/domain/event-type.enum';
import { Event } from 'src/event/domain/event.entity';

export class EventResponseDto {
  id: string;
  name: string;
  description?: string;
  startAt: string;
  endAt: string;
  type: string;
  condition: any;
  status: string;

  constructor(event: Event<EventType>) {
    this.id = event._id?.toString?.() ?? event.id;
    this.name = event.name;
    this.description = event.description;
    this.startAt = event.startAt instanceof Date ? event.startAt.toISOString() : event.startAt;
    this.endAt = event.endAt instanceof Date ? event.endAt.toISOString() : event.endAt;
    this.type = event.type;
    this.condition = event.condition;
    this.status = event.status;
  }

  static fromEntity(event: Event<EventType>): EventResponseDto {
    return new EventResponseDto(event);
  }
} 