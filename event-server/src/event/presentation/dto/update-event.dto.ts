import { IsOptional, IsString, IsDateString, IsEnum, ValidateNested, Validate } from 'class-validator';
import { EventStatus } from 'src/event/domain/event.entity';
import { EventCondition, EventType } from '../../domain/event-type.enum';
import { EventWithConditionValidator } from '../validator/event-with-condition.validator';

export class UpdateEventDto<T extends EventType = EventType> {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startAt?: string;

  @IsOptional()
  @IsDateString()
  endAt?: string;

  @IsEnum(EventType)
  @IsOptional()
  type?: T;

  @Validate(EventWithConditionValidator)
  condition?: EventCondition<T>;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
} 