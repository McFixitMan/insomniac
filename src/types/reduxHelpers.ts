import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { AnyAction } from 'redux';
import { RootState } from '../store';

export type AppThunkAction<R> = ThunkAction<R, RootState, undefined, AnyAction>;

export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction>;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;