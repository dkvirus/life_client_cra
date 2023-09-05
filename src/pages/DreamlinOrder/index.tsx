import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Form, Input, Typography, Popconfirm, DatePicker } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Box, Flex, InputNumber } from 'druikit';
import { createDreamlinOrder, listDreamlinOrders, modifyDreamlinOrder, removeDreamlinOrder } from 'apis';
import dayjs from 'dayjs'

interface DataType {
    id: string;
    occur_date: string;
    supply1688_price: number;
    supply1688_order_number?: string;
    store_price: number;
    store_order_number: string;
    price_diff: number;
    remark: string;
}

const Page = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: '日期',
            dataIndex: 'occur_date',
            key: 'occur_date',
            render(value, record, index) {
                return <>{value.slice(0, 10)}</>
            },
        },
        {
            title: '1688价格',
            dataIndex: 'supply1688_price',
            key: 'supply1688_price',
        },
        {
            title: '1688订单号',
            dataIndex: 'supply1688_order_number',
            key: 'supply1688_order_number',
            ellipsis: true,
        },
        {
            title: '小卖铺价格',
            dataIndex: 'store_price',
            key: 'store_price',
        },
        {
            title: '小卖铺订单号',
            dataIndex: 'store_order_number',
            key: 'store_order_number',
            ellipsis: true,
        },
        {
            title: '价格差',
            dataIndex: 'price_diff',
            key: 'price_diff',
            render(value, record, index) {
                return <>{(record.store_price || 0) - (record?.supply1688_price || 0)}</>
            },
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="删除"
                        description="确认删除这条数据吗?"
                        onConfirm={async () => await onRemove(record.id)}
                        okText="删除"
                        cancelText="取消"
                    >
                        <Button type="link" danger>删除</Button>
                    </Popconfirm>
                    <Button type="link" onClick={() => showModal(record)}>编辑</Button>
                </Space>
            ),
        },
    ]

    const [ dataSource, setDataSource ] = useState<DataType[]>([]) 

    const query = async () => {
        const result = await listDreamlinOrders()
        setDataSource(result)
    }

    useEffect(() => {
        query()
    }, [])

    /* ******************************* 模态框相关 **************************************** */
    const [ form ] = Form.useForm()
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ operateType, setOperateType ] = useState('create')

    const showModal = (record?: DataType) => {
        setOperateType(record ? 'modify' : 'create')
        form.setFieldsValue({
            ...record,
            occur_date: dayjs(record?.occur_date || new Date().toISOString().slice(0,10), 'YYYY-MM-DD'),
        })
        setIsModalOpen(true)
    }

    const handleOk = async () => {
        const values = form.getFieldsValue()
        if (operateType === 'create') {
            await createDreamlinOrder(values)
        } else {
            await modifyDreamlinOrder(values)
        }
        setIsModalOpen(false)
        form.resetFields()
        query()
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const onRemove = async (id: string) => {
        await removeDreamlinOrder(id)
        await query()
    }

    return (
        <>
            <Typography.Title level={3}>梦林的订单管理</Typography.Title>
            <Flex justifyContent="flex-end">
                <Button type="primary" onClick={() => showModal()}>新增</Button>
            </Flex>
            <Box height={20} />
            <Table
                dataSource={dataSource}
                columns={columns}
                bordered
            />
            <Modal title="订单操作" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    name="basic"
                    form={form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="主键"
                        name="id"
                        hidden
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="日期"
                        name="occur_date"
                        rules={[ { required: true, message: '请选择日期!' } ]}
                    >
                        <DatePicker />
                    </Form.Item>

                    <Form.Item
                        label="1688价格"
                        name="supply1688_price"
                        rules={[ { required: true, message: '请输入价格!' } ]}
                    >
                        <InputNumber />
                    </Form.Item>

                    <Form.Item
                        label="1688订单号"
                        name="supply1688_order_number"
                        rules={[ { required: true, message: '请输入订单号!' } ]}
                    >
                        <Input placeholder="请输入订单号!" />
                    </Form.Item>

                    <Form.Item
                        label="小卖铺价格"
                        name="store_price"
                        rules={[ { required: true, message: '请输入价格!' } ]}
                    >
                        <InputNumber />
                    </Form.Item>

                    <Form.Item
                        label="小卖铺订单号"
                        name="store_order_number"
                        rules={[ { required: true, message: '请输入订单号!' } ]}
                    >
                        <Input placeholder="请输入订单号!" />
                    </Form.Item>

                    <Form.Item
                        label="备注"
                        name="remark"
                        rules={[ { message: '请输入备注!' } ]}
                    >
                        <Input placeholder="请输入备注!" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default Page
