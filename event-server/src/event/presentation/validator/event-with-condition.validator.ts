import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { EventType } from '../../domain/event-type.enum';

@ValidatorConstraint({ name: 'EventConditionValidator', async: false })
export class EventWithConditionValidator implements ValidatorConstraintInterface {
  validate(condition: any, args: ValidationArguments) {
    const object = args.object as any;
    const type = object.type;

    if (type !== undefined && condition === undefined) return false;
    if (condition === undefined) return true;
    if (!type) return false;

    switch (type) {
      case EventType.NEW_USER: {
        const keys = Object.keys(condition);
        return (
          keys.length === 1 &&
          typeof condition.newUserWithinDays === 'number'
        );
      }
      case EventType.ATTENDANCE: {
        const keys = Object.keys(condition);
        return (
          keys.length === 1 &&
          typeof condition.requiredDays === 'number'
        );
      }
      case EventType.FRIEND_INVITE: {
        const keys = Object.keys(condition);
        return (
          keys.length === 1 &&
          typeof condition.minInvites === 'number'
        );
      }
      case EventType.SPECIAL_DATE: {
        const keys = Object.keys(condition);
        return (
          keys.length === 1 &&
          condition.specialDateRange &&
          typeof condition.specialDateRange.from === 'string' &&
          typeof condition.specialDateRange.to === 'string'
        );
      }
      default:
        return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const object = args.object as any;
    return `condition 필드가 type(${object.type})에 맞는 구조가 아닙니다.`;
  }
} 