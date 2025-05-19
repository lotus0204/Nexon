import { RewardService } from './reward.service';
import { RewardType, Reward } from '../domain/reward.entity';
import { RewardCreateInput } from './dto/reward-create.input';
import { NotFoundException } from '@nestjs/common';
import { MongooseRewardRepository } from '../infra/mongoose-reward.repository';
import { Types } from 'mongoose';

function createMockReward(props: any) {
  const _id = props._id || new Types.ObjectId();
  return {
    ...props,
    _id,
    toObject: function () { return this; },
    toJSON: function () { return this; },
  };
}

describe('RewardService', () => {
  let service: RewardService;
  let repository: jest.Mocked<MongooseRewardRepository>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAllByEventId: jest.fn(),
      deleteById: jest.fn(),
    } as unknown as jest.Mocked<MongooseRewardRepository>;
    service = new RewardService(repository);
  });

  describe('createReward', () => {
    it('보상을 성공적으로 생성한다', async () => {
      const input: RewardCreateInput = {
        name: '보상1',
        type: RewardType.ITEM,
        eventId: 'event1',
        description: '설명',
        amount: 10,
        imageUrl: 'url',
      };
      const savedReward = createMockReward({
        name: input.name,
        type: input.type,
        eventId: input.eventId,
        description: input.description,
        amount: input.amount,
        imageUrl: input.imageUrl,
      });
      repository.save.mockResolvedValue(savedReward);
      const result = await service.createReward(input);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toMatchObject({
        name: input.name,
        type: input.type,
        eventId: input.eventId,
        description: input.description,
        amount: input.amount,
        imageUrl: input.imageUrl,
      });
    });
  });

  describe('getRewardById', () => {
    it('존재하는 보상을 정상적으로 조회한다', async () => {
      const reward = createMockReward({
        name: '보상1',
        type: RewardType.ITEM,
        eventId: 'event1',
      });
      repository.findById.mockResolvedValue(reward);
      const result = await service.getRewardById('reward1');
      expect(result).toEqual(reward);
    });

    it('존재하지 않는 보상 조회 시 NotFoundException을 던진다', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.getRewardById('notfound')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteRewardById', () => {
    it('존재하는 보상을 정상적으로 삭제한다', async () => {
      const reward = createMockReward({ name: '보상1', type: RewardType.ITEM, eventId: 'event1' });
      repository.findById.mockResolvedValue(reward);
      repository.deleteById.mockResolvedValue();
      await expect(service.deleteRewardById('reward1')).resolves.toBeUndefined();
      expect(repository.deleteById).toHaveBeenCalledWith('reward1');
    });

    it('존재하지 않는 보상 삭제 시 NotFoundException을 던진다', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.deleteRewardById('notfound')).rejects.toThrow(NotFoundException);
    });
  });
});
