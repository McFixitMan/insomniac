import { CONFIG_SETTINGS_COMMAND, ConfigSettingsCommands } from '../commands/configSettings';
import { CONFIG_SETTINGS_EVENT, ConfigSettingsEvents } from '../events/configSettings';
import { CommandPreloader, EventPreloader } from '../types/preloader';

import { typedIpcRenderer } from '../ipcRenderer';

const configSettingsEventsPreloader: EventPreloader<ConfigSettingsEvents> = {
    onConfigSettingsChanged: (handler) => typedIpcRenderer.on(CONFIG_SETTINGS_EVENT.onConfigSettingsChanged, (_, configSettings) => {
        handler(configSettings);
    }),
};

const configSettingsCommandsPreloader: CommandPreloader<ConfigSettingsCommands> = {
    getConfigSettings: () => typedIpcRenderer.invoke(CONFIG_SETTINGS_COMMAND.getConfigSettings),
    setConfigSettings: (configSettings) => typedIpcRenderer.invoke(CONFIG_SETTINGS_COMMAND.setConfigSettings, configSettings),
};

export const configSettingsPreload = {
    ...configSettingsEventsPreloader,
    ...configSettingsCommandsPreloader,
};
