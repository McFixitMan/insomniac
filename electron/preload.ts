import { configSettingsPreload } from './preloadFunctions/configSettings';
import { contextBridge } from 'electron';
import { envPreload } from './preloadFunctions/env';
import { statusPreload } from './preloadFunctions/status';
import { windowPreload } from './preloadFunctions/window';

export const env = {
    ...envPreload,
};

export const api = {
    ...configSettingsPreload,
    ...statusPreload,
    ...windowPreload,
};

contextBridge.exposeInMainWorld('env', env);
contextBridge.exposeInMainWorld('api', api);
