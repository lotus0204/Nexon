import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RewardRequest, RewardRequestSchema } from '../domain/reward-request.entity';
import { RewardRequestStatus } from '../domain/reward-request-status.enum';

@Injectable()
export class MongooseRewardRequestRepository {
  constructor(
    @InjectModel(RewardRequest.name) private readonly rewardRequestModel: Model<RewardRequest>,
  ) {}

  async save(request: Partial<RewardRequest>): Promise<RewardRequest> {
    let doc: RewardRequest;
    if (request._id) {
      doc = await this.rewardRequestModel.findByIdAndUpdate(
        request._id,
        request,
        { new: true, upsert: true }
      ).exec();
    } else {
      doc = new this.rewardRequestModel(request);
      doc = await doc.save();
    }
    return doc;
  }

  async findById(id: string): Promise<RewardRequest | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.rewardRequestModel.findById(new Types.ObjectId(id)).exec();
  }

  async findAllByUserId(userId: string): Promise<RewardRequest[]> {
    return this.rewardRequestModel.find({ userId }).exec();
  }

  async findAllByEventId(eventId: string): Promise<RewardRequest[]> {
    return this.rewardRequestModel.find({ eventId }).exec();
  }

  async findAllByRewardId(rewardId: string): Promise<RewardRequest[]> {
    return this.rewardRequestModel.find({ rewardId }).exec();
  }

  async updateStatus(id: string, status: RewardRequestStatus, reason?: string): Promise<RewardRequest | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.rewardRequestModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      { status, reason },
      { new: true }
    ).exec();
  }

  async deleteById(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) return;
    await this.rewardRequestModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }

  async findAllByCriteria(criteria: any): Promise<RewardRequest[]> {
    const filter: any = {};
    if (criteria.userId) filter.userId = criteria.userId;
    if (criteria.eventId) filter.eventId = criteria.eventId;
    if (criteria.status) filter.status = criteria.status;
    return this.rewardRequestModel.find(filter).exec();
  }
} 