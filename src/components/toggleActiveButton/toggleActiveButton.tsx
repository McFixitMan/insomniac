import * as React from 'react';

import { Button, ButtonProps } from 'antd';

import classNames from 'classnames';
import { useAppSelector } from '@/types/reduxHelpers';

interface ToggleActiveButtonProps extends ButtonProps {

}

export const ToggleActiveButton: React.FC<ToggleActiveButtonProps> = (props) => {
    // const isActive = useAppSelector((state) => state.electron.isActive);
    const isActive = useAppSelector(state => state.electron.isActive);

    return (
        <Button
            type="primary"
            {...props}
            className={classNames('toggle-active-button', props.className)}
            onClick={async () => {
                await window.api.toggleIsActive();
            }}
        >
            {isActive ? 'Turn Off' : 'Turn On'}
        </Button>
    );
};