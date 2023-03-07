import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IEventService } from './interface/event-service.interface';

@Injectable()
export class EventService implements IEventService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public emit<T>(event: string, payload: T): void {
    this.eventEmitter.emit(event, payload);
  }
}
