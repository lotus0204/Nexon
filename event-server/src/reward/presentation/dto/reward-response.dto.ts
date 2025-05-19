import { EventResponseDto } from 'src/event/presentation/dto/event-response.dto';
import { Reward } from '../../domain/reward.entity';
import { Event } from 'src/event/domain/event.entity';

export class RewardResponseDto {
  id: string;
  name: string;
  description?: string;
  type: string;
  amount?: number;
  imageUrl?: string;
  event: EventResponseDto;

  constructor(reward: Reward, event: Event) {
    this.id = reward._id?.toString?.() ?? reward.id;
    this.name = reward.name;
    this.description = reward.description;
    this.type = reward.type;
    this.amount = reward.amount;
    this.imageUrl = reward.imageUrl;
    this.event = EventResponseDto.fromEntity(event);
  }

  static fromEntity(reward: Reward, event: Event) {
    return new RewardResponseDto(reward, event);
  }
} 