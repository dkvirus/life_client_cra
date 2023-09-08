import React from 'react'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

export const DateRange = ({
    value,
    onChange,
}: {
    value?: string;
    onChange?: (value: string) => void;
}) => {

    const rangePresets: {
        label: string;
        value: [Dayjs, Dayjs];
    }[] = [
        { label: '当前月', value: [ dayjs().startOf('month'), dayjs().endOf('month') ] },
        { label: '上个月', value: [ dayjs().month(dayjs().month() - 1).startOf('month'), dayjs().month(dayjs().month() - 1).endOf('month') ] },
        { label: '最近7天', value: [ dayjs().add(-7, 'd'), dayjs() ] },
        { label: '最近30天', value: [ dayjs().add(-30, 'd'), dayjs() ] },
        { label: '最近90天', value: [ dayjs().add(-90, 'd'), dayjs() ] },
        { label: '最近365天', value: [ dayjs().add(-365, 'd'), dayjs() ] },
    ]

    return (
        <DatePicker.RangePicker
            allowClear={true}
            presets={rangePresets}
            value={value?.split('_')?.map(v => dayjs(v)) as [Dayjs, Dayjs]}
            onChange={(dates: null | (Dayjs | null)[], dateStrings: string[]) => {
                onChange?.(dateStrings.filter(item => item).join('_'))
            }}
        />
    )
}
