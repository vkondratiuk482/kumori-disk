import { Module } from '@nestjs/common';
import { EventServiceProvider } from './providers/event-service.provider';

@Module({
  providers: [EventServiceProvider],
  exports: [EventServiceProvider],
})
export class EventModule {}
