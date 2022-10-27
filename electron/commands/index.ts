import { ConfigSettingsCommands } from './configSettings';
import { EnvCommands } from './env';
import { StatusCommands } from './status';
import { WindowCommands } from './window';
import { fields } from '../utility/fields';

export type Commands = ConfigSettingsCommands & StatusCommands & WindowCommands & EnvCommands;

export const COMMAND = fields<Commands>();