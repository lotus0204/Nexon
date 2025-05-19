import { Module } from '@nestjs/common';
import { MongooseUserEventProgressRepository } from './infra/mongoose-user-event-progress.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEventProgress, UserEventProgressSchema } from './domain/user-event-progress.entity';
import { UserEventProgressService } from './application/user-event-progress.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserEventProgress.name, schema: UserEventProgressSchema },
    ]),
  ],
  providers: [MongooseUserEventProgressRepository, UserEventProgressService],
  exports: [MongooseUserEventProgressRepository, UserEventProgressService],
})
export class UserEventModule {}