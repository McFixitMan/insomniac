import * as React from 'react';

import { AppHeader } from '@/components/appHeader';
import { AppRoutes } from './routes/appRoutes';
import { ConfigProvider } from 'antd';
import { HashRouter } from 'react-router-dom';
import { PageWrapper } from '@/components/pageWrapper/pageWrapper';
import { useElectronReduxConnector } from '@/hooks';

interface CoreLayoutProps {

}

export const ScrollContext = React.createContext<Partial<{ scrollContainerRef: React.RefObject<HTMLDivElement> }>>({});
export const CoreLayout: React.FC<CoreLayoutProps> = (props) => {

    useElectronReduxConnector();

    const scrollRef = React.useRef<HTMLDivElement>(null);

    return (
        <ConfigProvider
            componentSize="middle"
            autoInsertSpaceInButton={true}
        >
            <HashRouter>
                <div
                    className="core-layout__viewport main-content"
                >
                    <div className="layout-header">
                        <AppHeader />
                    </div>

                    <div
                        className="layout-main"
                    >
                        <ScrollContext.Provider value={{ scrollContainerRef: scrollRef }}>
                            <div className="layout-routes" ref={scrollRef}>
                                <React.Suspense
                                    fallback={
                                        <PageWrapper
                                            isLoading={true}
                                            loadingMessage={'Loading...'}
                                        />
                                    }
                                >
                                    <AppRoutes />
                                </React.Suspense>
                            </div>
                        </ScrollContext.Provider>
                    </div>
                </div>
            </HashRouter>
        </ConfigProvider>
    );
};