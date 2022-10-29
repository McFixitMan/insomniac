import './activeStatusCard.less';

import * as React from 'react';

import { AttentionSeeker, Flip } from 'react-awesome-reveal';
import { Card, CardProps, Col, Row } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

import { ToggleActiveButton } from '@/components/toggleActiveButton';
import classNames from 'classnames';
import { useAppSelector } from '@/types/reduxHelpers';

interface ActiveStatusCardProps extends CardProps {

}

export const ActiveStatusCard: React.FC<ActiveStatusCardProps> = (props) => {
    const isActive = useAppSelector(state => state.electron.isActive);
    const specialStatus = useAppSelector(state => state.electron.specialStatus);

    const getStatusDescriptor = React.useCallback(() => {
        if (isActive) {
            switch (specialStatus) {
                case 'outOfSchedule': {
                    return 'Sleeping';
                }
                default: {
                    return 'On';
                }
            }
        } else {
            return 'Off';
        }
    }, [isActive, specialStatus]);

    return (
        <Card
            bordered={false}
            {...props}
            className={classNames('active-status-card', props.className)}
        >
            <Row
                align="middle"
                justify="center"
                gutter={[10, 10]}
            >
                <Col
                    span={24}
                    style={{ textAlign: 'center' }}
                >
                    {
                        isActive === false
                            ?
                            <AttentionSeeker
                                effect="swing"
                            >
                                <EyeInvisibleOutlined
                                    className="status-icon"
                                />
                            </AttentionSeeker>
                            :
                            !!specialStatus
                                ?
                                <AttentionSeeker
                                    key="special-status"
                                    effect="headShake"
                                >
                                    <EyeInvisibleOutlined
                                        className={classNames('status-icon', 'warn')}
                                    />
                                </AttentionSeeker>
                                :
                                <Flip
                                    key="active"
                                    duration={500}
                                >
                                    <EyeOutlined
                                        className={classNames('status-icon', 'active')}
                                    />
                                </Flip>

                    }

                </Col>
                <Col style={{ textAlign: 'center' }}>
                    Insomniac is
                    <div style={{ textAlign: 'center' }} className={classNames('status-text', { active: isActive, inactive: !isActive, warn: !!specialStatus })}>
                        {getStatusDescriptor()}
                    </div>
                </Col>

                <Col
                    span={24}
                    style={{ textAlign: 'center' }}
                >
                    <ToggleActiveButton />
                </Col>
            </Row>

        </Card>
    );
};