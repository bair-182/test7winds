import React from 'react';
import { Select } from 'antd';

const SelectAntdComponent: React.FC = () => (
    <>
        <Select
            defaultValue="1"
            style={{ width: 170}}
            options={[
                {
                    value: '1',
                    label: 'Аббревиатура',

                },
                {
                    value: '2',
                    label: 'Полное название',
                },
            ]}
        />

    </>
);

export default SelectAntdComponent;