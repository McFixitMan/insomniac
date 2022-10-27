import { createAction, createReducer } from '@reduxjs/toolkit';

type ConfigSettings = Awaited<ReturnType<typeof window.api.getConfigSettings>>;
type SpecialStatus = Awaited<ReturnType<typeof window.api.getStatus>>;


export const setIsActive = createAction<boolean>('electron/setIsActive');
export const setStatus = createAction<SpecialStatus>('electron/setStatus');
export const setConfigSettings = createAction<ConfigSettings>('electron/setConfigSettings');
export const setIsMaximized = createAction<boolean>('electron/setIsMaximized');

interface ElectronState {
    isActive: boolean;
    specialStatus?: SpecialStatus;
    configSettings?: ConfigSettings;
    isMaximized: boolean;
}

const initialState: ElectronState = {
    isActive: false,
    specialStatus: undefined,
    isMaximized: false,
};

export const electronReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setIsActive, (state, action) => {
            state.isActive = action.payload;
        })
        .addCase(setStatus, (state, action) => {
            state.specialStatus = action.payload;
        })
        .addCase(setConfigSettings, (state, action) => {
            state.configSettings = { ...action.payload };
        })
        .addCase(setIsMaximized, (state, action) => {
            state.isMaximized = action.payload;
        });
});