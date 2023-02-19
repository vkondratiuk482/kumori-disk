import { Provider } from '@nestjs/common';
import { EventEmitterEventServiceImplementation } from '../event-emitter-event.service';
import { EVENT_CONSTANTS } from '../event.constants';

export const EventServiceProvider: Provider = {
  useClass: EventEmitterEventServiceImplementation,
  provide: EVENT_CONSTANTS.APPLICATION.SERVICE_TOKEN,
};
