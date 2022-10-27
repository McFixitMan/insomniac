import { CommandPreloader, EventPreloader } from '../types/preloader';
import { WINDOW_COMMAND, WindowCommands } from '../commands/window';
import { WINDOW_EVENT, WindowEvents } from '../events/window';

import { typedIpcRenderer } from '../ipcRenderer';

const windowEventsPreloader: EventPreloader<WindowEvents> = {
    onMaximized: (handler) => typedIpcRenderer.on(WINDOW_EVENT.onMaximized, () => {
        handler();
    }),
    onUnmaximized: (handler) => typedIpcRenderer.on(WINDOW_EVENT.onUnmaximized, () => {
        handler();
    }),
};

const windowCommandsPreloader: CommandPreloader<WindowCommands> = {
    getIsMaximized: () => typedIpcRenderer.invoke(WINDOW_COMMAND.getIsMaximized),
    hideWindow: () => typedIpcRenderer.invoke(WINDOW_COMMAND.hideWindow),
    setIsMaximized: (isMaximized) => typedIpcRenderer.invoke(WINDOW_COMMAND.setIsMaximized, isMaximized),
    toggleDevTools: () => typedIpcRenderer.invoke(WINDOW_COMMAND.toggleDevTools),
};

export const windowPreload = {
    ...windowEventsPreloader,
    ...windowCommandsPreloader,
};