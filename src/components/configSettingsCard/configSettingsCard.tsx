import './configSettingsCard.less';

import * as React from 'react';

import { Card, CardProps, Checkbox, Col, Divider, Form, Row, Spin, TimePicker } from 'antd';

import classNames from 'classnames';
import moment from 'moment';
import { useAppSelector } from '@/types/reduxHelpers';

interface ConfigSettingsCardProps extends CardProps {

}

const defaultStartHour = 8;
const defaultStartMinute = 0;
const defaultEndHour = 17;
const defaultEndMinute = 0;

export const ConfigSettingsCard: React.FC<ConfigSettingsCardProps> = (props) => {
    const configSettings = useAppSelector(state => state.electron.configSettings);

    const startTimePicker = React.useRef<HTMLInputElement>(null);
    const endTimePicker = React.useRef<HTMLInputElement>(null);

    const getStartMoment = React.useCallback(() => {
        return moment()
            .hour(configSettings?.schedule.startHour ?? defaultStartHour)
            .minute(configSettings?.schedule.startMinute ?? defaultStartMinute)
            .second(0)
            .millisecond(0);
    }, [configSettings?.schedule.startHour, configSettings?.schedule.startMinute]);

    const getEndMoment = React.useCallback(() => {
        return moment()
            .hour(configSettings?.schedule.endHour ?? defaultEndHour)
            .minute(configSettings?.schedule.endMinute ?? defaultEndMinute)
            .second(0)
            .millisecond(0);
    }, [configSettings?.schedule.endHour, configSettings?.schedule.endMinute]);

    if (!configSettings) {
        return (
            <Card
                bordered={false}
                {...props}
                className={classNames('config-settings-card', props.className)}
            >
                <Row
                    align="middle"
                    justify="center"
                >
                    <Col>
                        <Spin
                            size="large"
                        />
                    </Col>
                </Row>

            </Card>
        );
    }

    return (
        <Card
            bordered={false}
            {...props}
            className={classNames('config-settings-card', props.className)}
        >
            <Divider>Settings</Divider>

            <Form.Item>
                <Checkbox
                    checked={configSettings.sleepOnWeekends}
                    onChange={(e) => {
                        window.api.setConfigSettings({
                            ...configSettings,
                            sleepOnWeekends: e.target.checked,
                        });
                    }}
                >
                    Sleep On Weekends
                </Checkbox>
            </Form.Item>

            <Form.Item>
                <Checkbox
                    checked={configSettings.isScheduleEnabled}
                    onChange={(e) => {
                        window.api.setConfigSettings({
                            ...configSettings,
                            isScheduleEnabled: e.target.checked,
                        });
                    }}
                >
                    Enable Awake Schedule
                </Checkbox>
            </Form.Item>

            <Row
                align="middle"
                justify="center"
                gutter={10}
            >
                <Col
                    span={12}
                    style={{ textAlign: 'center' }}
                >
                    <Form.Item
                        label="Start"
                        labelCol={{ span: 24, style: { textAlign: 'center' } }}
                    >
                        <TimePicker
                            ref={startTimePicker}
                            format={'h:mm A'}
                            style={{ width: '100%' }}
                            popupClassName="time-picker-popup"
                            placement="topRight"
                            disabled={!configSettings.isScheduleEnabled}
                            value={getStartMoment()}
                            allowClear={false}
                            onChange={(value) => {
                                const hour = value?.hour() ?? defaultStartHour;
                                const minute = value?.minute() ?? defaultStartMinute;

                                window.api.setConfigSettings({
                                    ...configSettings,
                                    schedule: {
                                        ...configSettings.schedule,
                                        startHour: hour,
                                        startMinute: minute,
                                    },
                                });

                                // The time picker sometimes opens again right after pressing ok
                                // Doing this hacky fix because its super annoying
                                startTimePicker.current?.blur();
                            }}
                        />
                    </Form.Item>
                </Col>

                <Col
                    span={12}
                    style={{ textAlign: 'center' }}
                >
                    <Form.Item
                        label="End"
                        labelCol={{ span: 24, style: { textAlign: 'center' } }}
                    >
                        <TimePicker
                            ref={endTimePicker}
                            format={'h:mm A'}
                            style={{ width: '100%' }}
                            popupClassName="time-picker-popup"
                            placement="topLeft"
                            disabled={!configSettings.isScheduleEnabled}
                            value={getEndMoment()}
                            allowClear={false}
                            onChange={(value) => {
                                const hour = value?.hour() ?? defaultEndHour;
                                const minute = value?.minute() ?? defaultEndMinute;

                                window.api.setConfigSettings({
                                    ...configSettings,
                                    schedule: {
                                        ...configSettings.schedule,
                                        endHour: hour,
                                        endMinute: minute,
                                    },
                                });

                                // The time picker sometimes opens again right after pressing ok
                                // Doing this hacky fix because its super annoying
                                endTimePicker.current?.blur();
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>



        </Card>
    );
};