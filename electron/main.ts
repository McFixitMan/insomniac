import { COMMAND, Commands } from './commands';

import { ElectronManager } from './electronManager';
import { Events } from './events';
import { TypedIpcMain } from 'electron-typed-ipc';
import { ipcMain } from 'electron';

export const typedIpcMain = ipcMain as TypedIpcMain<Events, Commands>;

const manager = new ElectronManager();

typedIpcMain.handle(COMMAND.toggleIsActive, () => {
    return manager.setIsActive(!manager.isActive);
});

typedIpcMain.handle(COMMAND.getIsActive, () => {
    return manager.isActive;
});

typedIpcMain.handle(COMMAND.setIsActive, (_, isActive) => {
    return manager.setIsActive(isActive);
});

typedIpcMain.handle(COMMAND.setStatus, (_, status) => {
    return manager.setSpecialStatus(status);
});

typedIpcMain.handle(COMMAND.getStatus, () => {
    return manager.specialStatus;
});

typedIpcMain.handle(COMMAND.getConfigSettings, () => {
    return manager.store.store;
});

typedIpcMain.handle(COMMAND.setConfigSettings, (_, configSettings) => {
    return manager.setConfigSettings(configSettings);
});

typedIpcMain.handle(COMMAND.toggleDevTools, () => {
    return manager.toggleDevtools();
});

typedIpcMain.handle(COMMAND.hideWindow, () => {
    manager.window?.hide();
});

typedIpcMain.handle(COMMAND.getIsMaximized, () => {
    return manager.window?.isMaximized() ?? false;
});

typedIpcMain.handle(COMMAND.setIsMaximized, (_, isMaximized) => {
    if (isMaximized === true && manager.window?.isMaximized() === false) {
        manager.window.maximize();
    }

    if (isMaximized === false && manager.window?.isMaximized() === true) {
        manager.window.unmaximize();
    }

    return isMaximized;
});

typedIpcMain.handle(COMMAND.getIsDev, () => {
    return manager.isDev;
});

typedIpcMain.handle(COMMAND.getVersions, () => {
    return {
        electron: process.versions.electron,
        chrome: process.versions.chrome,
        node: process.versions.node,
    };
});