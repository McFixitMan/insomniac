import { TypedIpcRenderer } from 'electron-typed-ipc';

// TODO: We should be able to figure out what needs to be invoked by the ipcRenderer automatically...
// Maybe we can simplify the shape of this

declare type InputMap = {
    [key: string]: (...args: any) => any;
};

export type EventPreloader<E extends InputMap> = { [key in keyof E]: (handler: E[key]) => TypedIpcRenderer<E, Record<string, any>> }

export type CommandPreloader<C extends InputMap> = { [key in keyof C]: (...args: Parameters<C[key]>) => Promise<ReturnType<C[key]>> }