import { Body, Controller, Post } from '@nestjs/common';
import { UserEventProgressService } from '../application/user-event-progress.service';
import { UserEventProgressUpsertDto } from '../domain/dto/user-event-progress-upsert.dto';

@Controller('user-event-progress')
export class UserEventProgressController {
  constructor(private readonly userEventProgressService: UserEventProgressService) {}

  @Post()
  async upsert(@Body() dto: UserEventProgressUpsertDto) {
    return this.userEventProgressService.upsert(dto);
  }
} 