import { Controller, Post, Body, Param, Get, Query, Patch } from '@nestjs/common';
import { EventService } from '../application/event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventCreateInput } from '../application/dto/event-create.input';
import { EventQueryDto } from './dto/event-query.dto';
import { EventQueryInput } from '../application/dto/event-query.input';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventUpdateInput } from '../application/dto/event-update.input';
import { EventResponseDto } from './dto/event-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiOperation({ summary: '이벤트 생성' })
  @ApiResponse({ status: 201, description: '이벤트 생성 성공', type: EventResponseDto })
  @ApiBody({ type: CreateEventDto })
  @Post()
  async create(@Body() dto: CreateEventDto): Promise<EventResponseDto> {
    console.log('create', dto);
    const input = new EventCreateInput({
      name: dto.name,
      description: dto.description,
      startAt: new Date(dto.startAt),
      endAt: new Date(dto.endAt),
      type: dto.type,
      condition: dto.condition,
      status: dto.status,
    });
    const event = await this.eventService.createEvent(input);
    return EventResponseDto.fromEntity(event);
  }

  @ApiOperation({ summary: '이벤트 단건 조회' })
  @ApiResponse({ status: 200, description: '이벤트 단건 조회 성공', type: EventResponseDto })
  @ApiParam({ name: 'id', description: '이벤트 ID' })
  @Get(':id')
  async getById(@Param('id') id: string): Promise<EventResponseDto> {
    const event = await this.eventService.getEventById(id);
    return EventResponseDto.fromEntity(event);
  }

  @ApiOperation({ summary: '이벤트 목록 조회' })
  @ApiResponse({ status: 200, description: '이벤트 목록 조회 성공', type: [EventResponseDto] })
  @ApiQuery({ name: 'name', required: false, description: '이벤트 이름' })
  @ApiQuery({ name: 'status', required: false, description: '이벤트 상태' })
  @ApiQuery({ name: 'type', required: false, description: '이벤트 타입' })
  @ApiQuery({ name: 'startAtFrom', required: false, description: '시작일(From)' })
  @ApiQuery({ name: 'startAtTo', required: false, description: '시작일(To)' })
  @Get()
  async getAll(@Query() query: EventQueryDto): Promise<EventResponseDto[]> {
    const input = new EventQueryInput({
      name: query.name,
      status: query.status,
      type: query.type,
      startAtFrom: query.startAtFrom ? new Date(query.startAtFrom) : undefined,
      startAtTo: query.startAtTo ? new Date(query.startAtTo) : undefined,
    });
    const events = await this.eventService.getAllEvents(input);
    return events.map(e => EventResponseDto.fromEntity(e));
  }

  @ApiOperation({ summary: '이벤트 수정' })
  @ApiResponse({ status: 200, description: '이벤트 수정 성공', type: EventResponseDto })
  @ApiParam({ name: 'id', description: '이벤트 ID' })
  @ApiBody({ type: UpdateEventDto })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto): Promise<EventResponseDto> {
    const input = new EventUpdateInput({
      id,
      name: dto.name,
      description: dto.description,
      startAt: dto.startAt ? new Date(dto.startAt) : undefined,
      endAt: dto.endAt ? new Date(dto.endAt) : undefined,
      type: dto.type,
      condition: dto.condition,
      status: dto.status,
    });
    const event = await this.eventService.updateEvent(input);
    return EventResponseDto.fromEntity(event);
  }
} 