import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum RewardType {
  ITEM = 'ITEM',
  CURRENCY = 'CURRENCY',
  POINT = 'POINT',
  COUPON = 'COUPON',
}

@Schema()
export class Reward extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  type: RewardType;

  @Prop()
  amount?: number;

  @Prop({ required: true, type: 'string', ref: 'Event' })
  eventId: string;

  @Prop()
  imageUrl?: string;
}

export const RewardSchema = SchemaFactory.createForClass(Reward); 