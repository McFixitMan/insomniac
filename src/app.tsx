import 'antd/dist/antd.min.css';
import './app.less';

import { AppWrapper } from './appWrapper';
import React from 'react';
import { configureStore } from './store';

const configuredStore = configureStore();
export const store = configuredStore.store;

const App: React.FC = () => {
    return (
        <AppWrapper
            store={store}
        />
    );
};

export default App;
