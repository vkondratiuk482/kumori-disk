import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventService } from './interface/event-service.interface';

@Injectable()
export class EventEmitterEventServiceImplementation implements EventService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public emit<T>(event: string, payload: T): void {
    this.eventEmitter.emit(event, payload);
  }
}
