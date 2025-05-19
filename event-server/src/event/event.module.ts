import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventService } from './application/event.service';
import { EventController } from './presentation/event.controller';
import { MongooseEventRepository } from './infra/mongoose-event.repository';
import { EventSchema } from './domain/event.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  controllers: [EventController],
  providers: [
    EventService,
    MongooseEventRepository
  ],
  exports: [EventService, MongooseEventRepository],
})
export class EventModule {} 