import { EventService } from './event.service';
import { EventStatus } from '../domain/event.entity';
import { EventCreateInput } from './dto/event-create.input';
import { EventQueryInput } from './dto/event-query.input';
import { EventUpdateInput } from './dto/event-update.input';
import { NotFoundException } from '@nestjs/common';
import { EventType } from '../domain/event-type.enum';
import { MongooseEventRepository } from '../infra/mongoose-event.repository';
import { Types } from 'mongoose';

function createMockEvent(props: any) {
  const _id = props._id || new Types.ObjectId();
  return {
    ...props,
    _id,
    eventId: typeof _id === 'object' && _id.toHexString ? _id.toHexString() : String(_id),
    toObject: function () { return this; },
    toJSON: function () { return this; },
  };
}

describe('EventService', () => {
  let service: EventService;
  let repository: jest.Mocked<MongooseEventRepository>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<MongooseEventRepository>;
    service = new EventService(repository);
  });

  describe('createEvent', () => {
    it('이벤트를 성공적으로 생성한다', async () => {
      const input = new EventCreateInput({
        name: '이벤트1',
        description: '설명',
        startAt: new Date('2024-01-01'),
        endAt: new Date('2024-01-31'),
        type: 'TYPE1' as EventType,
        condition: '조건' as any,
        status: EventStatus.ENABLED,
      });
      const event = createMockEvent({
        name: input.name,
        description: input.description,
        startAt: input.startAt,
        endAt: input.endAt,
        type: input.type,
        condition: input.condition,
        status: input.status,
      });
      repository.save.mockResolvedValue(event);
      const result = await service.createEvent(input);
      expect(result).toMatchObject({
        name: event.name,
        description: event.description,
        startAt: event.startAt,
        endAt: event.endAt,
        condition: event.condition,
        status: event.status,
      });
      expect(result.eventId).toBe(event.eventId);
    });
  });

  describe('getEventById', () => {
    it('존재하는 이벤트를 정상적으로 조회한다', async () => {
      const event = createMockEvent({
        name: '이벤트1',
        description: '설명',
        startAt: new Date(),
        endAt: new Date(),
        type: 'TYPE1' as EventType,
        condition: '조건' as any,
        status: EventStatus.ENABLED,
      });
      repository.findById.mockResolvedValue(event);
      const result = await service.getEventById(event.eventId);
      expect(result).toEqual(event);
    });

    it('존재하지 않는 이벤트 조회 시 에러 발생한다', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.getEventById('notfound')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllEvents', () => {
    it('이벤트 목록을 정상적으로 조회한다', async () => {
      const events = [
        createMockEvent({
          name: '이벤트1',
          description: '설명',
          startAt: new Date(),
          endAt: new Date(),
          type: 'TYPE1' as EventType,
          condition: '조건' as any,
          status: EventStatus.ENABLED,
          _id: new Types.ObjectId(),
        }),
        createMockEvent({
          name: '이벤트2',
          description: '설명2',
          startAt: new Date(),
          endAt: new Date(),
          type: 'TYPE2' as EventType,
          condition: '조건2' as any,
          status: EventStatus.DISABLED,
          _id: new Types.ObjectId(),
        }),
      ];
      repository.findAll.mockResolvedValue(events);
      const input = new EventQueryInput({});
      const result = await service.getAllEvents(input);
      expect(result).toEqual(events);
    });
  });

  describe('updateEvent', () => {
    it('존재하는 이벤트를 정상적으로 수정한다', async () => {
      const oldEvent = createMockEvent({
        name: '이벤트1',
        description: '설명',
        startAt: new Date('2024-01-01'),
        endAt: new Date('2024-01-31'),
        type: 'TYPE1' as EventType,
        condition: '조건' as any,
        status: EventStatus.ENABLED,
        _id: new Types.ObjectId(),
      });
      repository.findById.mockResolvedValue(oldEvent);
      repository.save.mockResolvedValue(oldEvent);
      const input = new EventUpdateInput({
        id: oldEvent.eventId,
        name: '수정된이벤트',
      });
      const result = await service.updateEvent(input);
      expect(result.name).toBe('수정된이벤트');
      expect(result.eventId).toBe(oldEvent.eventId);
    });

    it('존재하지 않는 이벤트 수정 시 NotFoundException을 던진다', async () => {
      repository.findById.mockResolvedValue(null);
      const input = new EventUpdateInput({ id: 'notfound', name: '수정' });
      await expect(service.updateEvent(input)).rejects.toThrow(NotFoundException);
    });
  });
});
