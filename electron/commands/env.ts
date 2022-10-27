import { fields } from '../utility/fields';

export type EnvCommands = {
    getIsDev: () => boolean;
    getVersions: () => { chrome: string; node: string; electron: string };
}

export const ENV_COMMAND = fields<EnvCommands>();