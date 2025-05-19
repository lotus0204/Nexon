import { Injectable, NotFoundException } from '@nestjs/common';
import { Event } from '../domain/event.entity';
import { EventCreateInput } from './dto/event-create.input';
import { EventQueryInput } from './dto/event-query.input';
import { EventCriteria } from '../domain/dto/event-criteria';
import { EventUpdateInput } from './dto/event-update.input';
import { EventType } from '../domain/event-type.enum';
import { MongooseEventRepository } from '../infra/mongoose-event.repository';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: MongooseEventRepository) {}

  async createEvent(input: EventCreateInput<EventType>): Promise<Event<EventType>> {
    return this.eventRepository.save(input);
  }

  async getEventById(id: string): Promise<Event<EventType>> {
    const event = await this.eventRepository.findById(id);
    if (!event) throw new NotFoundException('이벤트를 찾을 수 없습니다.');
    return event;
  }

  async getAllEvents(input: EventQueryInput): Promise<Event<EventType>[]> {
    const criteria = new EventCriteria<EventType>(input);
    return this.eventRepository.findAll(criteria);
  }

  async updateEvent(input: EventUpdateInput<EventType>): Promise<Event<EventType>> {
    const event = await this.eventRepository.findById(input.id);
    if (!event) throw new NotFoundException('이벤트를 찾을 수 없습니다.');
    this.assignEventFields(event, input);

    await this.eventRepository.save(event);
    return event;
  }

  private assignEventFields(event: Event<EventType>, input: Partial<Event<EventType>>): void {
    if (input.status !== undefined) event.status = input.status;
    if (input.name !== undefined) event.name = input.name;
    if (input.description !== undefined) event.description = input.description;
    if (input.startAt !== undefined) event.startAt = input.startAt;
    if (input.endAt !== undefined) event.endAt = input.endAt;
    if (input.type !== undefined) event.type = input.type as any;
    if (input.condition !== undefined) event.condition = input.condition as any;
  }
} 