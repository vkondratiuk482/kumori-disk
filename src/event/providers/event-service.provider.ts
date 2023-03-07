import { Provider } from '@nestjs/common';
import { EventService } from '../event.service';
import { EVENT_CONSTANTS } from '../event.constants';

export const EventServiceProvider: Provider = {
  useClass: EventService,
  provide: EVENT_CONSTANTS.APPLICATION.SERVICE_TOKEN,
};
