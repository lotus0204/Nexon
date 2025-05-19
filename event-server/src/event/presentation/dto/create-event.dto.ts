import { IsString, IsDateString, IsOptional, IsEnum, Validate } from 'class-validator';
import { EventStatus } from 'src/event/domain/event.entity';
import { EventCondition, EventType } from '../../domain/event-type.enum';
import { EventWithConditionValidator } from '../validator/event-with-condition.validator';

export class CreateEventDto<T extends EventType = EventType> {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDateString()
  startAt: string;

  @IsDateString()
  endAt: string;

  @IsEnum(EventType)
  type: T;

  @Validate(EventWithConditionValidator)
  condition: EventCondition<T>;

  @IsString()
  @IsOptional()
  status?: EventStatus;
} 