import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEventProgress } from '../domain/user-event-progress.entity';
import { UserEventProgressCriteria } from '../domain/dto/user-event-progress-criteria';
import { UserEventProgressUpsertDto } from '../domain/dto/user-event-progress-upsert.dto';

export class MongooseUserEventProgressRepository {
  constructor(
    @InjectModel(UserEventProgress.name) private readonly progressModel: Model<UserEventProgress>,
  ) {}

  async findByUserIdAndEventId(criteria: UserEventProgressCriteria): Promise<UserEventProgress | null> {
    return this.progressModel.findOne({
      userId: criteria.userId,
      eventId: criteria.eventId,
    }).exec();
  }

  async upsert(dto: UserEventProgressUpsertDto): Promise<UserEventProgress> {
    const { userId, eventId } = dto;
    return this.progressModel.findOneAndUpdate(
      { userId, eventId },
      { $set: { ...dto } },
      { upsert: true, new: true },
    ).exec();
  }
} 