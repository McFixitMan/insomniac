import { ENV_COMMAND, EnvCommands } from '../commands/env';

import { CommandPreloader } from '../types/preloader';
import { typedIpcRenderer } from '../ipcRenderer';

const envCommandsPreloader: CommandPreloader<EnvCommands> = {
    getIsDev: () => typedIpcRenderer.invoke(ENV_COMMAND.getIsDev),
    getVersions: () => typedIpcRenderer.invoke(ENV_COMMAND.getVersions),
};

export const envPreload = {
    ...envCommandsPreloader,
};