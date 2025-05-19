import { Injectable } from '@nestjs/common';
import { MongooseUserEventProgressRepository } from '../infra/mongoose-user-event-progress.repository';
import { UserEventProgressUpsertDto } from '../domain/dto/user-event-progress-upsert.dto';
import { UserEventProgress } from '../domain/user-event-progress.entity';

@Injectable()
export class UserEventProgressService {
  constructor(
    private readonly userEventProgressRepository: MongooseUserEventProgressRepository,
  ) {}

  async upsert(dto: UserEventProgressUpsertDto): Promise<UserEventProgress> {
    return this.userEventProgressRepository.upsert(dto);
  }
} 