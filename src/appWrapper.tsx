import * as React from 'react';

import { CoreLayout } from './coreLayout';
import { Provider } from 'react-redux';
import { RootState } from './store/createStore';
import { Store } from 'redux';

interface AppWrapperProps {
    store: Store<RootState>;
}

export const AppWrapper: React.FC<AppWrapperProps> = (props) => {

    return (
        <Provider
            store={props.store}
        >
            <div
                style={{ height: '100%' }}
            >
                <CoreLayout />
            </div>
        </Provider>
    );
};