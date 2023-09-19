import React, { useEffect } from 'react'
import { Typography, TabsProps, Tabs } from 'antd'
import EditGood from './EditGood'
import CheckGood from './CheckGood'
import { useDreamlinGoodApiData } from './hook'

const Page = () => {
    const { fetchDreamlinGoods } = useDreamlinGoodApiData()

    useEffect(() => {
        fetchDreamlinGoods()
    }, [])

    const items: TabsProps['items'] = [
        {
            key: 'edit',
            label: '商品维护',
            children: <EditGood />,
        },
        {
            key: 'price',
            label: 'SKU 价格维护',
            children: <CheckGood />,
        },
    ]

    return (
        <>
            <Typography.Title level={3}>梦林的商品管理</Typography.Title>
            <Tabs items={items} />
        </>
    )
}

export default Page
