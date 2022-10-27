import { Commands } from './commands';
import { Events } from './events';
import { TypedIpcRenderer } from 'electron-typed-ipc';
import { ipcRenderer } from 'electron';

export const typedIpcRenderer = ipcRenderer as TypedIpcRenderer<Events, Commands>;