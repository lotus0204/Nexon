import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EventType } from '../../event/domain/event-type.enum';

@Schema()
export class UserEventProgress extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  eventId: string;

  @Prop({ required: true })
  eventType: EventType;

  @Prop()
  attendanceDays?: number;

  @Prop()
  invitedFriends?: number;

  @Prop()
  firstJoinedAt?: Date;
}

export const UserEventProgressSchema = SchemaFactory.createForClass(UserEventProgress); 