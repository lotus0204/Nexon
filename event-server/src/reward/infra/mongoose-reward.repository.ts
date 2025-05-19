import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reward, RewardType } from '../domain/reward.entity';
import { Event } from 'src/event/domain/event.entity';

@Injectable()
export class MongooseRewardRepository {
  constructor(
    @InjectModel(Reward.name) private readonly rewardModel: Model<Reward>,
  ) {}

  async save(reward: Partial<Reward>): Promise<{ reward: Reward; event: Event }> {
    let doc: Reward;
    if (reward._id) {
      doc = await this.rewardModel.findByIdAndUpdate(
        reward._id,
        reward,
        { new: true, upsert: true }
      ).exec();
    } else {
      doc = new this.rewardModel(reward);
      doc = await doc.save();
    }
    const populated = await doc.populate('eventId');
    let event;
    let eventId: any = populated.eventId;
    if (eventId && typeof eventId === 'object' && (eventId as any)._id) {
      event = eventId;
      eventId = (eventId as any)._id.toString();
    }
    const rewardObj = populated.toObject();
    rewardObj.eventId = eventId;
    return {
      reward: rewardObj,
      event,
    };
  }

  async findById(id: string): Promise<{
    reward: Reward;
    event: Event;
  } | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.rewardModel.findById(new Types.ObjectId(id)).populate('eventId').exec();
    if (!doc) return null;

    const rewardObj = doc.toObject();
    let event;
    let eventId = rewardObj.eventId;
    if (eventId && typeof eventId === 'object' && (eventId as any)._id) {
      event = eventId;
      eventId = (eventId as any)._id.toString();
    }
    rewardObj.eventId = rewardObj.eventId['_id'];
    
    return {
      reward: rewardObj,
      event,
    };
  }

  async deleteById(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) return;
    await this.rewardModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }
} 