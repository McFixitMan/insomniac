
// export interface ScheduleInfo {
//     isScheduleEnabled: boolean;
//     schedule?: {
//         startsAt: Date;
//         endsAt: Date;
//     }
//     isWithinSchedule: () => boolean;
// }

import { Schedule } from './schedule';

export type ScheduleInfo = {
    isScheduleEnabled: false;
} | {
    isScheduleEnabled: true;
    schedule: Schedule & {
        startsAt: Date;
        endsAt: Date;
    };
    isWithinSchedule: () => boolean;
}