import './pageWrapper.less';

import * as React from 'react';

import { Button, Col, Divider, Row } from 'antd';
import { LoadingOutlined, WarningOutlined } from '@ant-design/icons';
import { NonIdealAction, PageWrapperProps } from './pageWrapperProps';

import classNames from 'classnames';
import { useAppRoutes } from '../../hooks/useAppRoutes';
import { useNavigate } from 'react-router';

export const PageWrapper: React.FC<React.PropsWithChildren<PageWrapperProps>> = (props) => {

    const appRoutes = useAppRoutes();
    const navigate = useNavigate();

    const topRef = React.createRef<HTMLDivElement>();
    const contentRef = React.createRef<HTMLDivElement>();

    React.useEffect(() => {
        const scrollOptions: ScrollIntoViewOptions = {
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
        };

        switch (props.scrollBehaviorOnMount) {
            case 'top': {
                topRef.current?.scrollIntoView(scrollOptions);
                break;
            }
            case 'none': {
                break;
            }
            case 'content':
            case undefined:
            default: {
                contentRef.current?.scrollIntoView(scrollOptions);
                break;
            }
        }
    }, []);

    const className = classNames('page-wrapper', props.containerClassName);

    const containerStyle: React.CSSProperties = props.isNonIdeal
        ? { ...props.style, overflow: 'hidden' }
        : { ...props.style };

    const overrideActionText = (action?: NonIdealAction): string => {
        switch (action) {
            case 'back': {
                return 'Go Back';
            }
            case 'home': {
                return 'Go Home';
            }
            case 'reload': {
                return 'Reload';
            }
            default: {
                return action || '';
            }
        }
    };

    const handleActionClicked = (action: NonIdealAction): void => {
        switch (action) {
            case 'back': {
                navigate(-1);
                break;
            }

            case 'reload': {
                window.location.reload();
                break;
            }

            case 'home': {
                navigate(appRoutes.home.path);
                break;
            }

            default: {
                // other
                break;
            }
        }
    };

    return (
        <Row
            className={className}
            style={containerStyle}
            align="top"
            justify="center"
            ref={topRef}
        >
            <Col
                xxl={14}
                xl={16}
                lg={18}
                md={20}
                sm={24}
                xs={24}
                {...props.customTitleBreakpoints}
                style={{ padding: 5 }}
            >
                <Row
                    align="top"
                    justify="center"
                    className="page"
                >
                    {!!props.pageTitle &&
                        <Col span={24}>
                            {(typeof props.pageTitle === 'string')
                                ?
                                <Divider
                                    className="page-title"
                                >
                                    {props.pageTitle}
                                </Divider>
                                :
                                props.pageTitle
                            }
                        </Col>
                    }

                </Row>
            </Col>

            <Col
                xxl={24}
                xl={24}
                lg={24}
                md={24}
                sm={24}
                xs={24}
                {...props.customContentBreakpoints}
                style={{ padding: 5 }}
            >
                <Row
                    align="top"
                    justify="center"
                >
                    <Col span={24} className="page-wrapper-content" ref={contentRef}>
                        {props.children}
                    </Col>
                </Row>

            </Col>

            {props.isNonIdeal === true &&
                <div className="non-ideal-page">
                    <Row
                        align="middle"
                        justify="center"
                    >
                        <Col
                            span={24}
                            style={{ textAlign: 'center' }}
                        >
                            {!!props.nonIdealIcon
                                ?
                                <span className="non-ideal-icon">
                                    {props.nonIdealIcon}
                                </span>
                                :
                                <WarningOutlined className="non-ideal-icon" />
                            }
                        </Col>

                        <Col
                            span={24}
                            className="non-ideal-header"
                            style={{ textAlign: 'center' }}
                        >
                            {props.nonIdealHeader}
                        </Col>

                        <Col
                            span={24}
                            className="non-ideal-subheader"
                            style={{ textAlign: 'center', padding: '0 10px' }}
                        >
                            {props.nonIdealSubheader}
                        </Col>

                        <Row
                            align="middle"
                            justify="center"
                        >
                            <Col
                                xxl={24}
                                xl={24}
                                lg={24}
                                md={24}
                                sm={24}
                                xs={24}
                            >
                                <Row
                                    align="middle"
                                    justify="center"
                                    gutter={50}
                                >
                                    {!!props.nonIdealActions &&
                                        props.nonIdealActions.map((action) => {
                                            if (typeof action === 'string') {
                                                return (
                                                    <Col
                                                        key={action}
                                                    >
                                                        <Button
                                                            style={{ minWidth: '350px' }}
                                                            key={action}

                                                            onClick={() => handleActionClicked(action)}
                                                        >
                                                            {overrideActionText(action)}
                                                        </Button>
                                                    </Col>

                                                );
                                            }

                                            return (
                                                <Col
                                                    key={action.text}
                                                >
                                                    <Button
                                                        style={{ minWidth: '350px' }}
                                                        key={action.text}
                                                        onClick={() => action.action()}
                                                    >
                                                        {action.text}
                                                    </Button>
                                                </Col>
                                            );
                                        })
                                    }
                                </Row>
                            </Col>

                        </Row>

                    </Row>
                </div>

            }

            {!!props.isLoading === true &&
                <div className="page-wrapper-loading">
                    <p>
                        <LoadingOutlined className="page-wrapper-loading-icon" />
                    </p>
                    <p className="page-wrapper-loading-header">
                        {props.loadingMessage || 'Loading...'}
                    </p>
                </div>
            }
        </Row>
    );
};