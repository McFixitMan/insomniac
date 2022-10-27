import * as React from 'react';

import { setConfigSettings, setIsActive, setIsDev, setIsMaximized, setStatus } from '@/store/modules/electronModule';

import { useAppDispatch } from '@/types/reduxHelpers';

export const useElectronReduxConnector = (): void => {
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        const getIsDevAsync = async (): Promise<void> => {
            const isDev = await window.env.getIsDev();

            dispatch(setIsDev(isDev));
        };

        const getIsActiveAsync = async (): Promise<void> => {
            const isActive = await window.api.getIsActive();

            dispatch(setIsActive(isActive));
        };

        const getStatusAsync = async (): Promise<void> => {
            const status = await window.api.getStatus();

            dispatch(setStatus(status));
        };

        const getConfigSettingsAsync = async (): Promise<void> => {
            const configSettings = await window.api.getConfigSettings();

            dispatch(setConfigSettings(configSettings));
        };

        const getIsMaximizedAsync = async (): Promise<void> => {
            const isMaximized = await window.api.getIsMaximized();

            dispatch(setIsMaximized(isMaximized));
        };

        getIsDevAsync();
        getIsActiveAsync();
        getStatusAsync();
        getConfigSettingsAsync();
        getIsMaximizedAsync();

        window.api.onIsActiveChanged((isActive) => {
            dispatch(setIsActive(isActive));
        });

        window.api.onStatusChanged((status) => {
            dispatch(setStatus(status));
        });

        window.api.onConfigSettingsChanged((configSettings) => {
            dispatch(setConfigSettings(configSettings));
        });

        window.api.onMaximized(() => {
            dispatch(setIsMaximized(true));
        });

        window.api.onUnmaximized(() => {
            dispatch(setIsMaximized(false));
        });
    }, []);
};