import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RewardRequestStatus } from './reward-request-status.enum';

@Schema()
export class RewardRequest extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  eventId: string;

  @Prop({ required: true })
  rewardId: string;

  @Prop({ type: String, enum: Object.values(RewardRequestStatus), required: true })
  status: RewardRequestStatus;

  @Prop({ required: true })
  requestedAt: Date;

  @Prop()
  processedAt?: Date;

  @Prop()
  reason?: string;
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest); 