import { ConfigSettingsCommands } from './configSettings';
import { StatusCommands } from './status';
import { WindowCommands } from './window';
import { fields } from '../utility/fields';

export type Commands = ConfigSettingsCommands & StatusCommands & WindowCommands;

export const COMMAND = fields<Commands>();