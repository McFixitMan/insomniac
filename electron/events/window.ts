import { fields } from '../utility/fields';

export type WindowEvents = {
    onMaximized: () => void;
    onUnmaximized: () => void;
};

export const WINDOW_EVENT = fields<WindowEvents>();