import { configSettingsPreload } from './preloadFunctions/configSettings';
import { contextBridge } from 'electron';
import { statusPreload } from './preloadFunctions/status';
import { windowPreload } from './preloadFunctions/window';

export const api = {
    ...configSettingsPreload,
    ...statusPreload,
    ...windowPreload,
};

contextBridge.exposeInMainWorld('api', api);
