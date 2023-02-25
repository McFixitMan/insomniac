import * as Store from 'electron-store';
import * as isDev from 'electron-is-dev';
import * as path from 'path';

import { BrowserWindow, Menu, NativeImage, Tray, app, dialog, nativeImage, screen } from 'electron';
import { Key, keyboard } from '@nut-tree/nut-js';

import { ConfigSettings } from './types/configSettings';
import { Events } from './events';
import { STATUS_EVENT } from './events/status';
import { ScheduleInfo } from './types/scheduleInfo';
import { SpecialStatus } from './types/specialStatus';
import { TypedWebContents } from 'electron-typed-ipc';

const activeImagePath = isDev ? './assets/logo-on.ico' : path.join(process.resourcesPath, 'assets', 'logo-on.ico');
const inactiveImagePath = isDev ? './assets/logo-off.ico' : path.join(process.resourcesPath, 'assets', 'logo-off.ico');
const warningImagePath = isDev ? './assets/logo-warn.ico' : path.join(process.resourcesPath, 'assets', 'logo-warn.ico');

const activeImage = nativeImage.createFromPath(activeImagePath);
const inactiveImage = nativeImage.createFromPath(inactiveImagePath);
const warningImage = nativeImage.createFromPath(warningImagePath);

const keepAlive = (): void => {
    keyboard.pressKey(Key.F13);
};

class ElectronManager {
    // status: Status = 'active';
    specialStatus?: SpecialStatus = undefined;
    isActive = true;
    isQuitting = false;

    activityLoop?: NodeJS.Timer;
    tray?: Tray;
    store: Store<ConfigSettings>;
    window?: BrowserWindow;
    webContents?: TypedWebContents<Events>;
    isDev: boolean;

    constructor() {
        this.store = new Store<ConfigSettings>({
            defaults: {
                isScheduleEnabled: false,
                schedule: {
                    startHour: 8,
                    startMinute: 0,
                    endHour: 17,
                    endMinute: 0,
                },
                sleepOnWeekends: true,
                intervalSeconds: 30,
            },
        });

        this.isDev = isDev;

        this.initializeApp();
    }

    initializeApp = (): void => {
        app.setAppUserModelId('Insomniac');

        app.on('ready', async () => {
            this.createWindow();
            this.createTray();

            this.activityLoop = setInterval(this.performMainAction, 1000 * this.store.get('intervalSeconds'));

            if (isDev) {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const devtoolsInstaller = require('electron-devtools-installer');
                const installExtension = devtoolsInstaller.default;
                const { REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } = devtoolsInstaller;
                try {
                    console.log('Adding redux devtools extension...');
                    await installExtension(REDUX_DEVTOOLS);
                    console.log(`Added redux devtools extension`);

                    console.log('Adding react devtools extension...');
                    await installExtension(REACT_DEVELOPER_TOOLS);
                    console.log(`Added react devtools extension`);
                } catch (err) {
                    console.log(`Error adding extension:`, err);
                }
            }
        });

        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                clearInterval(this.activityLoop);

                app.quit();
            }
        });

        app.on('activate', () => {
            if (this.window === null) {
                this.createWindow();
            }
        });
    };

    setConfigSettings = (configSettings: ConfigSettings): ConfigSettings => {
        this.store.set(configSettings);

        clearInterval(this.activityLoop);
        this.activityLoop = setInterval(this.performMainAction, 1000 * configSettings.intervalSeconds);

        this.webContents?.send('onConfigSettingsChanged', configSettings);

        this.performMainAction();

        return configSettings;
    };

    getStatusImage = (): NativeImage => {
        if (this.isActive) {
            switch (this.specialStatus) {
                case 'outOfSchedule': {
                    return warningImage;
                }
                default: {
                    return activeImage;
                }
            }
        } else {
            return inactiveImage;
        }
    };

    getStatusDescriptor = (): string => {
        if (this.isActive) {
            switch (this.specialStatus) {
                case 'outOfSchedule': {
                    return 'Sleeping';
                }
                default: {
                    return 'Active';
                }
            }
        } else {
            return 'Inactive';
        }
    };

    getScheduleInfo = (): ScheduleInfo => {
        const isScheduleEnabled = this.store.get('isScheduleEnabled');
        const schedule = this.store.get('schedule');

        if (isScheduleEnabled && !!schedule) {
            const scheduleStart = new Date();
            scheduleStart.setHours(schedule.startHour);
            scheduleStart.setMinutes(schedule.startMinute);
            scheduleStart.setSeconds(0);
            scheduleStart.setMilliseconds(0);

            const scheduleEnd = new Date();
            scheduleEnd.setHours(schedule.endHour);
            scheduleEnd.setMinutes(schedule.endMinute);
            scheduleEnd.setSeconds(0);
            scheduleEnd.setMilliseconds(0);

            if (scheduleEnd <= scheduleStart) {
                scheduleEnd.setDate(scheduleEnd.getDate() + 1);
            }

            return {
                isScheduleEnabled: isScheduleEnabled,
                schedule: {
                    ...schedule,
                    startsAt: scheduleStart,
                    endsAt: scheduleEnd,
                },
                isWithinSchedule: () => {
                    const now = new Date();

                    const lastScheduleStart = new Date(scheduleStart);
                    lastScheduleStart.setDate(lastScheduleStart.getDate() - 1);

                    const lastScheduleEnd = new Date(scheduleEnd);
                    lastScheduleEnd.setDate(lastScheduleEnd.getDate() - 1);

                    return (now >= scheduleStart && now <= scheduleEnd) || (now >= lastScheduleStart && now <= lastScheduleEnd);
                },
            };
        } else {
            return {
                isScheduleEnabled: false,
            };
        }
    };

    // TODO: Think of a better name for this, you animal
    performMainAction = (): void => {
        if (this.isActive) {
            const scheduleInfo = this.getScheduleInfo();

            const day = new Date().getDay();

            if (this.store.get('sleepOnWeekends') && (day === 6 || day === 0)) {
                // Active, but not within our schedule window - no action
                if (this.specialStatus !== 'outOfSchedule') {
                    this.setSpecialStatus('outOfSchedule');
                }

                return;
            }

            if (scheduleInfo.isScheduleEnabled) {
                if (scheduleInfo.isWithinSchedule()) {
                    // Active and we're in our schedule window - keep alive
                    keepAlive();

                    if (this.specialStatus !== undefined) {
                        this.setSpecialStatus(undefined);
                    }
                } else {
                    // Active, but not within our schedule window - no action
                    if (this.specialStatus !== 'outOfSchedule') {
                        this.setSpecialStatus('outOfSchedule');
                    }
                }
            } else {
                // Active, and no schedule configured - always keep alive
                keepAlive();

                if (this.specialStatus !== undefined) {
                    this.setSpecialStatus(undefined);
                }
            }
        } else {
            // Not active - no action
            if (this.specialStatus !== undefined) {
                this.setSpecialStatus(undefined);
            }
        }
    };

    exit = async (): Promise<void> => {
        const messageBoxReturnValue = await dialog.showMessageBox({
            message: 'Are you sure you want to quit insomniac?',
            type: 'warning',
            title: 'Quit Insomniac',
            cancelId: 0,
            noLink: true,
            buttons: [
                'Cancel',
                'Quit',
            ],
        });

        if (messageBoxReturnValue.response === 1) {
            this.isQuitting = true;

            clearInterval(this.activityLoop);

            app.quit();
        }
    };

    toggleDevtools = (): boolean => {
        const isDevToolsOpened = this.webContents?.isDevToolsOpened() ?? false;

        if (isDevToolsOpened) {
            this.webContents?.closeDevTools();

            return false;
        } else {
            this.webContents?.openDevTools({
                mode: 'detach',
            });

            return true;
        }
    };

    getTrayContextMenu = (): Menu => {
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Show App',
                type: 'normal',
                click: () => {
                    this.window?.show();
                },
            },
            {
                label: this.isActive ? 'Turn Off' : 'Turn On',
                type: 'normal',
                click: () => {
                    this.setIsActive(!this.isActive);
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Quit',
                type: 'normal',
                click: async () => {
                    await this.exit();
                },
            },
        ]);

        return contextMenu;
    };

    createTray = (): Tray => {
        this.tray = new Tray(this.getStatusImage());

        const statusImage = this.getStatusImage();
        const statusDescriptor = this.getStatusDescriptor();

        this.tray.setImage(statusImage);
        this.tray.setToolTip(`Insomniac: ${statusDescriptor}`);
        this.tray.setContextMenu(this.getTrayContextMenu());

        this.tray.on('right-click', (ev, bounds) => {
            this.setIsActive(!this.isActive);
        });

        this.tray.on('click', (ev, bounds) => {
            if (!this.window?.isVisible()) {
                this.window?.show();
            }
        });

        return this.tray;
    };

    setIsActive = (isActive: boolean): boolean => {
        this.isActive = isActive;

        this.performMainAction();

        this.updateAppStatus();

        this.webContents?.send(STATUS_EVENT.onIsActiveChanged, this.isActive);

        return this.isActive;
    };

    setSpecialStatus = (status?: SpecialStatus): SpecialStatus | undefined => {
        this.specialStatus = status;

        this.updateAppStatus();

        this.webContents?.send(STATUS_EVENT.onStatusChanged, this.specialStatus);

        return this.specialStatus;
    };

    updateAppStatus = (): void => {
        const statusImage = this.getStatusImage();
        const statusDescriptor = this.getStatusDescriptor();

        this.tray?.setImage(statusImage);
        this.tray?.setToolTip(`Insomniac: ${statusDescriptor}`);
        this.tray?.setContextMenu(this.getTrayContextMenu());

        this.window?.setIcon(statusImage);
    };

    createWindow = (): BrowserWindow => {
        const display = screen.getPrimaryDisplay();
        const displayWidth = display.bounds.width;
        const displayHeight = display.bounds.height;

        const appWidth = 450;
        const appHeight = 825;

        // Top right of the screen for mac, bottom right otherwise
        const xpos = displayWidth - appWidth;
        const ypos = process.platform === 'darwin'
            ? 0
            : displayHeight - appHeight;

        this.window = new BrowserWindow({
            width: appWidth,
            height: appHeight,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                // TODO: Probably better to turn sandbox on, but will need to figure out some wacky way to get webpack to bundle our preload script
                // Otherwise, everything we do in preload would have to exist completely in one file
                sandbox: false,
            },
            darkTheme: true,
            frame: false,
            title: 'Insomniac',
            x: xpos,
            y: ypos,
            show: false,
            autoHideMenuBar: true,
            resizable: false,
            movable: false,
            icon: this.getStatusImage(),
        });

        this.webContents = this.window.webContents;

        this.window.on('maximize', () => {
            this.webContents?.send('onMaximized');
        });

        this.window.on('unmaximize', () => {
            this.webContents?.send('onUnmaximized');
        });

        this.window.on('blur', () => {
            if (this.webContents?.isDevToolsOpened() === false) {
                this.window?.hide();
            }
        });

        this.window.on('minimize', () => {
            // Hide the window when minimized (to tray)
            this.window?.hide();
        });

        this.window.on('ready-to-show', () => {
            this.window?.show();

            this.performMainAction();
        });

        this.window.on('close', (event) => {
            if (!this.isQuitting) {
                // Unless we're specifically quitting, just hide the window to the tray when closing
                event.preventDefault();

                this.window?.hide();
            }
        });

        this.window.on('closed', () => {
            this.window = undefined;
        });

        if (isDev) {
            // Hot Reloading
            // 'node_modules/.bin/electronPath'
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('electron-reload')(__dirname, {
                electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
                forceHardReset: true,
                hardResetMethod: 'exit',
            });

            this.window.loadURL('http://localhost:3000/index.html');
        } else {
            // 'build/index.html'
            this.window.loadURL(`file://${__dirname}/../index.html`);
        }

        return this.window;
    };
}

export { ElectronManager };