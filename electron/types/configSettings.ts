import { Schedule } from './schedule';

export interface ConfigSettings {
    isScheduleEnabled: boolean;
    schedule: Schedule;
    sleepOnWeekends: boolean;
    intervalSeconds: number;
}