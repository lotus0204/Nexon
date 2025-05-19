import { Module } from '@nestjs/common';
import { EventConditionValidateManager } from './event-condition-validate.manager';

@Module({
  providers: [EventConditionValidateManager],
  exports: [EventConditionValidateManager],
})
export class EventConditionValidateManagerModule {} 