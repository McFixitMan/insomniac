import './appHeader.less';

import * as React from 'react';

import { ArrowDownOutlined, BugOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Col, Row, Tooltip, message } from 'antd';

import classNames from 'classnames';
import { useAppSelector } from '@/types/reduxHelpers';

interface AppHeaderProps {

}

export const AppHeader: React.FC<AppHeaderProps> = (props) => {
    const isDev = useAppSelector(state => state.electron.isDev);
    const isActive = useAppSelector(state => state.electron.isActive);
    const specialStatus = useAppSelector(state => state.electron.specialStatus);

    const devToolsRef = React.useRef<HTMLButtonElement>(null);
    const closeRef = React.useRef<HTMLButtonElement>(null);

    return (
        <Row
            className="app-header"
            justify="space-between"
            align="middle"
            gutter={1}
        >
            <Col>
                <Row
                    align="middle"
                    justify="start"
                >
                    <Col>
                        <Row>
                            <Col>
                                <div
                                    className="header-title"
                                    style={{ flex: 0, alignSelf: 'middle', marginLeft: 10, marginRight: 10 }}
                                >
                                    <span className={classNames('header-icon', { active: isActive, warn: !!specialStatus })}>
                                        {!isActive
                                            ? <EyeInvisibleOutlined />
                                            :
                                            !!specialStatus
                                                ? <EyeInvisibleOutlined />
                                                : <EyeOutlined />
                                        }
                                    </span>
                                    &nbsp;
                                    <span className="lighter">
                                        Insomniac
                                    </span>
                                </div>
                            </Col>

                        </Row>
                    </Col>
                </Row>
            </Col>

            <Col>
                {isDev &&
                    <Tooltip
                        title="Toggle DevTools"
                        placement="bottomLeft"
                    >
                        <Button
                            className="app-header-button"
                            ref={devToolsRef}
                            style={{ border: 'none' }}
                            icon={<BugOutlined />}
                            onClick={async () => {
                                const open = await window.api.toggleDevTools();

                                message.info(`DevTools ${open ? 'opened' : 'closed'}`);

                                devToolsRef.current?.blur();
                            }}
                        />
                    </Tooltip>
                }

                <Tooltip
                    title="Close to tray"
                    placement="bottomLeft"
                >
                    <Button
                        className="app-header-button"
                        ref={closeRef}
                        style={{ border: 'none' }}
                        icon={<ArrowDownOutlined />}
                        onClick={async () => {
                            await window.api.hideWindow();

                            closeRef.current?.blur();
                        }}
                    />
                </Tooltip>

            </Col>
        </Row>
    );
};