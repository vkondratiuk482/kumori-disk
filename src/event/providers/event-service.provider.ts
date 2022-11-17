import { Provider } from '@nestjs/common';
import { EventEmitterEventServiceImplementation } from '../event-emitter-event.service';
import { EVENT_SERVICE_TOKEN } from '../event.constants';

export const EventServiceProvider: Provider = {
  provide: EVENT_SERVICE_TOKEN,
  useClass: EventEmitterEventServiceImplementation,
};
