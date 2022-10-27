import { CommandPreloader, EventPreloader } from '../types/preloader';
import { STATUS_COMMAND, StatusCommands } from '../commands/status';
import { STATUS_EVENT, StatusEvents } from '../events/status';

import { typedIpcRenderer } from '../ipcRenderer';

const statusEventsPreloader: EventPreloader<StatusEvents> = {
    onStatusChanged: (handler) => typedIpcRenderer.on(STATUS_EVENT.onStatusChanged, (_, status) => {
        handler(status);
    }),

    onIsActiveChanged: (handler) => typedIpcRenderer.on(STATUS_EVENT.onIsActiveChanged, (_, isActive) => {
        handler(isActive);
    }),
};

const statusCommandsPreloader: CommandPreloader<StatusCommands> = {
    getStatus: () => typedIpcRenderer.invoke(STATUS_COMMAND.getStatus),
    setStatus: (status) => typedIpcRenderer.invoke(STATUS_COMMAND.setStatus, status),
    toggleIsActive: () => typedIpcRenderer.invoke(STATUS_COMMAND.toggleIsActive),
    getIsActive: () => typedIpcRenderer.invoke(STATUS_COMMAND.getIsActive),
    setIsActive: (isActive) => typedIpcRenderer.invoke(STATUS_COMMAND.setIsActive, isActive),
};

export const statusPreload = {
    ...statusEventsPreloader,
    ...statusCommandsPreloader,
};