import { fields } from '../utility/fields';

export type WindowCommands = {
    hideWindow: () => void;
    toggleDevTools: () => boolean;
    getIsMaximized: () => boolean;
    setIsMaximized: (isMaximized: boolean) => boolean;
};

export const WINDOW_COMMAND = fields<WindowCommands>();