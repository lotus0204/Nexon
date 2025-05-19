import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../domain/user.schema';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class MongooseUserRepository implements UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findByMapleId(mapleId: string): Promise<User | null> {
    return this.userModel.findOne({ mapleId }).exec();
  }

  async save(user: User): Promise<User> {
    return this.userModel.findOneAndUpdate(
      { mapleId: user.mapleId },
      user,
      { upsert: true, new: true }
    ).exec();
  }

  async deleteByMapleId(mapleId: string): Promise<void> {
    await this.userModel.deleteOne({ mapleId }).exec();
  }
} 