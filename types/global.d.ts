import { api, env } from '../electron/preload';

declare global {
    interface Window {
        api: typeof api,
        env: typeof env,
    }
}

export { };

