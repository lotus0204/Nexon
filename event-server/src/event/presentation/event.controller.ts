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
  @ApiBody({
    type: CreateEventDto,
    examples: {
      newUser: {
        summary: '신규유저 이벤트',
        value: {
          name: '신규유저 이벤트',
          description: '가입 후 7일 이내 유저 대상 이벤트',
          startAt: '2024-07-01T00:00:00.000Z',
          endAt: '2024-07-31T23:59:59.999Z',
          type: 'NEW_USER',
          condition: { newUserWithinDays: 7 },
          status: 'ENABLED'
        }
      },
      attendance: {
        summary: '출석 이벤트',
        value: {
          name: '출석 이벤트',
          description: '7일 연속 출석 시 보상 지급',
          startAt: '2024-07-01T00:00:00.000Z',
          endAt: '2024-07-31T23:59:59.999Z',
          type: 'ATTENDANCE',
          condition: { requiredDays: 7 },
          status: 'ENABLED'
        }
      },
      friendInvite: {
        summary: '친구초대 이벤트',
        value: {
          name: '친구초대 이벤트',
          description: '3명 이상 초대 시 보상',
          startAt: '2024-07-01T00:00:00.000Z',
          endAt: '2024-07-31T23:59:59.999Z',
          type: 'FRIEND_INVITE',
          condition: { minInvites: 3 },
          status: 'ENABLED'
        }
      },
      specialDate: {
        summary: '특별한 날 이벤트',
        value: {
          name: '크리스마스 이벤트',
          description: '크리스마스 기간 한정 이벤트',
          startAt: '2024-12-20T00:00:00.000Z',
          endAt: '2024-12-26T23:59:59.999Z',
          type: 'SPECIAL_DATE',
          condition: {
            specialDateRange: {
              from: '2024-12-24T00:00:00.000Z',
              to: '2024-12-25T23:59:59.999Z'
            }
          },
          status: 'ENABLED'
        }
      }
    }
  })
  @Post()
  async create(@Body() dto: CreateEventDto): Promise<EventResponseDto> {
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
  @ApiBody({
    type: UpdateEventDto,
    examples: {
      newUser: {
        summary: '신규유저 이벤트 수정',
        value: {
          name: '신규유저 이벤트(수정)',
          description: '가입 후 10일 이내 유저 대상 이벤트',
          startAt: '2024-07-05T00:00:00.000Z',
          endAt: '2024-08-01T23:59:59.999Z',
          type: 'NEW_USER',
          condition: { newUserWithinDays: 10 },
          status: 'ENABLED'
        }
      },
      attendance: {
        summary: '출석 이벤트 수정',
        value: {
          name: '출석 이벤트(수정)',
          description: '10일 연속 출석 시 보상 지급',
          startAt: '2024-07-10T00:00:00.000Z',
          endAt: '2024-08-10T23:59:59.999Z',
          type: 'ATTENDANCE',
          condition: { requiredDays: 10 },
          status: 'ENABLED'
        }
      },
      friendInvite: {
        summary: '친구초대 이벤트 수정',
        value: {
          name: '친구초대 이벤트(수정)',
          description: '5명 이상 초대 시 보상',
          startAt: '2024-07-10T00:00:00.000Z',
          endAt: '2024-08-10T23:59:59.999Z',
          type: 'FRIEND_INVITE',
          condition: { minInvites: 5 },
          status: 'ENABLED'
        }
      },
      specialDate: {
        summary: '특별한 날 이벤트 수정',
        value: {
          name: '연말 이벤트',
          description: '연말 기간 한정 이벤트',
          startAt: '2024-12-28T00:00:00.000Z',
          endAt: '2025-01-02T23:59:59.999Z',
          type: 'SPECIAL_DATE',
          condition: {
            specialDateRange: {
              from: '2024-12-31T00:00:00.000Z',
              to: '2025-01-01T23:59:59.999Z'
            }
          },
          status: 'ENABLED'
        }
      }
    }
  })
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