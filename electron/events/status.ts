import { SpecialStatus } from '../types/specialStatus';
import { fields } from '../utility/fields';

export type StatusEvents = {
    onIsActiveChanged: (isActive: boolean) => void;
    onStatusChanged: (status?: SpecialStatus) => void;
}

export const STATUS_EVENT = fields<StatusEvents>();