import { IsOptional, IsString, IsEnum } from 'class-validator';
import { EventType } from 'src/event/domain/event-type.enum';
import { EventStatus } from 'src/event/domain/event.entity';

export class EventQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @IsOptional()
  @IsEnum(EventType)
  type?: EventType;

  @IsOptional()
  @IsString()
  startAtFrom?: string;

  @IsOptional()
  @IsString()
  startAtTo?: string;
} 