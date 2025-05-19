import { RewardRequestService } from './reward-request.service';
import { RewardRequest } from '../domain/reward-request.entity';
import { RewardRequestCreateInput } from './dto/reward-request-create.input';
import { RewardRequestStatus } from '../domain/reward-request-status.enum';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('RewardRequestService', () => {
  let service: RewardRequestService;
  let rewardRequestRepository: any;
  let eventRepository: any;
  let userEventProgressRepository: any;
  let conditionValidatorService: any;

  beforeEach(() => {
    rewardRequestRepository = {
      findAllByUserId: jest.fn(),
      save: jest.fn(),
      findAllByCriteria: jest.fn(),
    };
    eventRepository = {
      findById: jest.fn(),
    };
    userEventProgressRepository = {
      findByUserIdAndEventId: jest.fn(),
    };
    conditionValidatorService = {
      validate: jest.fn(),
    };
    service = new RewardRequestService(
      rewardRequestRepository,
      eventRepository,
      userEventProgressRepository,
      conditionValidatorService,
    );
  });

  describe('create', () => {
    it('정상적으로 보상 요청을 생성한다', async () => {
      const input: RewardRequestCreateInput = {
        userId: 'user1',
        eventId: 'event1',
        rewardId: 'reward1',
      };
      rewardRequestRepository.findAllByUserId.mockResolvedValue([]);
      eventRepository.findById.mockResolvedValue({ type: 'ATTENDANCE', condition: { requiredDays: 3 } });
      userEventProgressRepository.findByUserIdAndEventId.mockResolvedValue({ attendanceDays: 5 });
      conditionValidatorService.validate.mockReturnValue('REQUESTED');
      rewardRequestRepository.save.mockResolvedValue({ _id: 'req1', ...input, status: 'REQUESTED' });

      const result = await service.create(input);
      expect(result).toMatchObject({ userId: 'user1', eventId: 'event1', rewardId: 'reward1', status: 'REQUESTED' });
    });

    it('중복 신청 시 ConflictException을 던진다', async () => {
      const input: RewardRequestCreateInput = {
        userId: 'user1',
        eventId: 'event1',
        rewardId: 'reward1',
      };
      rewardRequestRepository.findAllByUserId.mockResolvedValue([
        { eventId: 'event1', rewardId: 'reward1' },
      ]);
      await expect(service.create(input)).rejects.toThrow(ConflictException);
    });

    it('이벤트가 없으면 NotFoundException을 던진다', async () => {
      const input: RewardRequestCreateInput = {
        userId: 'user1',
        eventId: 'event1',
        rewardId: 'reward1',
      };
      rewardRequestRepository.findAllByUserId.mockResolvedValue([]);
      eventRepository.findById.mockResolvedValue(null);
      await expect(service.create(input)).rejects.toThrow(NotFoundException);
    });

    it('유저 이벤트 진행상황이 없으면 NotFoundException을 던진다', async () => {
      const input: RewardRequestCreateInput = {
        userId: 'user1',
        eventId: 'event1',
        rewardId: 'reward1',
      };
      rewardRequestRepository.findAllByUserId.mockResolvedValue([]);
      eventRepository.findById.mockResolvedValue({ type: 'ATTENDANCE', condition: { requiredDays: 3 } });
      userEventProgressRepository.findByUserIdAndEventId.mockResolvedValue(null);
      await expect(service.create(input)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getByUserId', () => {
    it('유저별 보상 요청 목록을 반환한다', async () => {
      const requests = [
        { _id: 'req1', userId: 'user1', eventId: 'event1', rewardId: 'reward1', status: 'REQUESTED' },
      ];
      rewardRequestRepository.findAllByUserId.mockResolvedValue(requests);
      const result = await service.getByUserId('user1');
      expect(result).toEqual(requests);
    });
  });

  describe('getListByCriteria', () => {
    it('조건에 맞는 보상 요청 목록을 반환한다', async () => {
      const criteria = { userId: 'user1', eventId: 'event1', status: RewardRequestStatus.SUCCESS };
      const requests = [
        { _id: 'req1', userId: 'user1', eventId: 'event1', rewardId: 'reward1', status: 'REQUESTED' },
      ];
      rewardRequestRepository.findAllByCriteria.mockResolvedValue(requests);
      const result = await service.getListByCriteria(criteria);
      expect(result).toEqual(requests);
    });
  });
}); 