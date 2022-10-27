import * as React from 'react';

import { Col, Row } from 'antd';

import { ActiveStatusCard } from '@/components/activeStatusCard';
import { ConfigSettingsCard } from '@/components/configSettingsCard';
import { PageWrapper } from '@/components/pageWrapper/pageWrapper';

interface HomePageProps {

}

export const HomePage: React.FC<HomePageProps> = (props) => {

    return (
        <PageWrapper>
            <Row
                align="middle"
                justify="center"
                gutter={[10, 10]}
            >
                <Col
                    span={24}
                >
                    <ActiveStatusCard />
                </Col>

                <Col
                    span={24}
                >
                    <ConfigSettingsCard
                        style={{ textAlign: 'center' }}
                    />
                </Col>
            </Row>
        </PageWrapper>
    );
};