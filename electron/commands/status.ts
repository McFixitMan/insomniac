import { SpecialStatus } from '../types/specialStatus';
import { fields } from '../utility/fields';

export type StatusCommands = {
    getStatus: () => SpecialStatus | undefined;
    setStatus: (status?: SpecialStatus) => SpecialStatus | undefined;

    getIsActive: () => boolean;
    setIsActive: (isActive: boolean) => boolean;
    toggleIsActive: () => boolean;
}

export const STATUS_COMMAND = fields<StatusCommands>();