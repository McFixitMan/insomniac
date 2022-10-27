import { ConfigSettings } from '../types/configSettings';
import { fields } from '../utility/fields';

export type ConfigSettingsEvents = {
    onConfigSettingsChanged: (configSettings: ConfigSettings) => void;
};

export const CONFIG_SETTINGS_EVENT = fields<ConfigSettingsEvents>();