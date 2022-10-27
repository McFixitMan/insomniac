import { AnyAction, Store, combineReducers } from 'redux';

import { AppDispatch } from '../types/reduxHelpers';
import { configureStore as configureReduxStore } from '@reduxjs/toolkit';
import { electronReducer } from '@/store/modules/electronModule';
import thunk from 'redux-thunk';

const makeRootReducer = combineReducers({
    electron: electronReducer,
});

export type RootState = ReturnType<typeof makeRootReducer>;

export function configureStore(initialState?: RootState): { store: Store<RootState, AnyAction> & { dispatch: AppDispatch } } {
    const rootReducer = makeRootReducer;

    const store = configureReduxStore({
        reducer: rootReducer,
        preloadedState: initialState,
        middleware: [thunk],
        devTools: process.env.NODE_ENV === 'development',
    });

    return { store };
}