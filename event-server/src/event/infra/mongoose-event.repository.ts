import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event } from '../domain/event.entity';

@Injectable()
export class MongooseEventRepository{
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

  async save(event: Partial<Event>): Promise<Event> {
    let doc: Event;
    if (event._id) {
      doc = await this.eventModel.findByIdAndUpdate(
        event._id,
        event,
        { new: true, upsert: true }
      ).exec();
    } else {
      doc = new this.eventModel(event);
      doc = await doc.save();
    }
    return doc;
  }

  async findById(id: string): Promise<Event | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.eventModel.findById(new Types.ObjectId(id)).exec();
  }

  async findAll(criteria?: any): Promise<Event[]> {
    const filter: any = {};
    if (criteria?.name) filter.name = { $regex: criteria.name, $options: 'i' };
    if (criteria?.status) filter.status = criteria.status;
    if (criteria?.type) filter.type = criteria.type;
    if (criteria?.startAtFrom || criteria?.startAtTo) {
      filter.startAt = {};
      if (criteria.startAtFrom) filter.startAt.$gte = criteria.startAtFrom;
      if (criteria.startAtTo) filter.startAt.$lte = criteria.startAtTo;
    }
    return this.eventModel.find(filter).exec();
  }
} 