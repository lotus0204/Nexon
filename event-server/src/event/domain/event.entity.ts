import { EventCondition, EventType } from './event-type.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export enum EventStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

@Schema()
export class Event<T extends EventType = EventType> extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  startAt!: Date;

  @Prop({ required: true })
  endAt!: Date;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  condition!: EventCondition<T>;

  @Prop({ type: String, enum: ['ENABLED', 'DISABLED', 'OPEN'], default: 'ENABLED' })
  status!: string;

  @Prop({ type: String, enum: Object.values(EventType), required: true })
  type!: T;

  get eventId(): string {
    return this._id instanceof Types.ObjectId ? this._id.toHexString() : String(this._id);
  }

  constructor(props?: {
    name: string;
    description?: string;
    startAt: Date;
    endAt: Date;
    type: T;
    condition: EventCondition<T>;
    status?: EventStatus;
  }) {
    super();
    if (props) {
      this.status = props.status ?? EventStatus.DISABLED;
      this.name = props.name;
      this.description = props.description;
      this.startAt = props.startAt;
      this.endAt = props.endAt;
      this.type = props.type;
      this.condition = props.condition;
    }
  }
}

export type EventDocument = Event & Document;
export const EventSchema = SchemaFactory.createForClass(Event); 