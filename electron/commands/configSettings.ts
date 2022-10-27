import { ConfigSettings } from '../types/configSettings';
import { fields } from '../utility/fields';

export type ConfigSettingsCommands = {
    getConfigSettings: () => ConfigSettings;
    setConfigSettings: (configSettings: ConfigSettings) => ConfigSettings;
};

export const CONFIG_SETTINGS_COMMAND = fields<ConfigSettingsCommands>();