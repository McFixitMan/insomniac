import * as React from 'react';

import { RouteType, appRoutes } from '../../routes/appRoutes';

export const useAppRoutes = (): RouteType => {
    const [routes] = React.useState(appRoutes);

    return routes;
};