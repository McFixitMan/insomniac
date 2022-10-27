import { ConfigSettingsEvents } from './configSettings';
import { StatusEvents } from './status';
import { WindowEvents } from './window';
import { fields } from '../utility/fields';

export type Events = ConfigSettingsEvents & StatusEvents & WindowEvents;

export const EVENT = fields<Events>();