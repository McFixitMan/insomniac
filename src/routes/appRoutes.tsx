import * as React from 'react';

import { Route, Routes } from 'react-router-dom';

import { AppRoute } from '../types/appRoute';
import { HomePage } from './pages/homePage';
import { NotFoundPage } from './pages/notFoundPage';

// https://stackoverflow.com/a/73966420/3253311
const typeObjectValues = <T extends Record<string, AppRoute>>(object: T): { [originalPropType in keyof T]: AppRoute } => {
    type propType = keyof typeof object;
    return object as { [originalPropType in propType]: AppRoute };
};

export const appRoutes = typeObjectValues({
    home: {
        title: 'Home',
        path: '',
        component: <HomePage />,
    },
});

export type RouteType = typeof appRoutes;

export const AppRoutes: React.FC = (props) => {
    return (
        <>
            <Routes>
                {Object.entries(appRoutes).map((entry) => {
                    const [_routeName, appRoute] = entry;

                    return (
                        <Route
                            key={appRoute.path}
                            path={appRoute.path}
                            element={appRoute.component}
                        />
                    );
                })}

                <Route
                    path="*"
                    element={<NotFoundPage />}
                />
            </Routes>
        </>
    );
};