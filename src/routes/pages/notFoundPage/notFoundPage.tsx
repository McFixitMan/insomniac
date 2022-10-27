import * as React from 'react';

import { FileSearchOutlined } from '@ant-design/icons';
import { PageWrapper } from '../../../components/pageWrapper/pageWrapper';
import { useLocation } from 'react-router-dom';

interface NotFoundPageProps {

}

export const NotFoundPage: React.FC<NotFoundPageProps> = (props) => {
    const location = useLocation();

    return (
        <PageWrapper
            isNonIdeal={true}
            nonIdealIcon={<FileSearchOutlined />}
            nonIdealHeader={'Page Not Found'}
            nonIdealSubheader={`Nothing was found at ${location.pathname}!`}
            nonIdealActions={['back', 'home']}
        />
    );
};