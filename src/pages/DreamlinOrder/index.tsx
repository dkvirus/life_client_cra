import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Form, Input, Typography, Popconfirm, DatePicker, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Box, Flex, Flex1, InputNumber } from 'druikit';
import { createDreamlinOrder, listDicts, listDreamlinOrders, listDreamlinSuppliers, modifyDreamlinOrder, removeDreamlinOrder } from 'apis';
import dayjs from 'dayjs'
import { DateRange } from 'components/DateRange';
import { getTotalPrice } from './utils';

interface DataType {
    id: string;
    occur_date: string;
    platform_name: string;
    platform_price: number;
    platform_order_number: string;
    platform_supplier_id?: string;
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
            width: 120,
            fixed: 'left',
            render(value, record, index) {
                return <>{value.slice(0, 10)}</>
            },
        },
        {
            title: '平台名称',
            dataIndex: 'platform_name',
            key: 'platform_name',
            width: 100,
            ellipsis: true,
        },
        {
            title: '价格(平台/卖铺)',
            dataIndex: 'platform_price',
            key: 'platform_price',
            width: 140,
            render(value, record, index) {
                return <>{record.platform_price} / {record.store_price}</>
            },
        },
        {
            title: '价格差',
            dataIndex: 'price_diff',
            key: 'price_diff',
            width: 100,
            render(value, record, index) {
                return <>{Number((record.store_price || 0) - (record?.platform_price || 0)).toFixed(2)}</>
            },
        },
        {
            title: '平台订单号',
            dataIndex: 'platform_order_number',
            key: 'platform_order_number',
            width: 220,
        },
        {
            title: '小卖铺订单号',
            dataIndex: 'store_order_number',
            key: 'store_order_number',
            ellipsis: true,
            width: 220,
        },
        {
            title: '供应商名称',
            dataIndex: 'platform_supply_name',
            key: 'platform_supply_name',
            width: 200,
            ellipsis: true,
            render(value, record, index) {
                const name = supplierDataSource?.find(item => item?.id === record.platform_supplier_id)?.name
                return <>{name}</>
            },
        },
        {
            title: '供应商ID',
            dataIndex: 'platform_supply_id',
            key: 'platform_supply_id',
            width: 200,
            ellipsis: true,
            render(value, record, index) {
                const code = supplierDataSource?.find(item => item?.id === record.platform_supplier_id)?.code
                return <>{code}</>
            },
        },
        {
            title: '供应商备注',
            dataIndex: 'platform_supply_remark',
            key: 'platform_supply_remark',
            width: 200,
            ellipsis: true,
            render(value, record, index) {
                const remark = supplierDataSource?.find(item => item?.id === record.platform_supplier_id)?.remark
                return <>{remark}</>
            },
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            width: 200,
            ellipsis: true,
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            fixed: 'right',
            width: 200,
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

    /* ******************************* 查询条件 **************************************** */
    const [ platformSupplierId, setPlatformSupplierId ] = useState()
    const [ dateRangeValue, setDateRangeValue ] = useState('')
    const [ dataSource, setDataSource ] = useState<DataType[]>([])
    const [ totalPrice, setTotalPrice ] = useState('0')

    const query = async () => {
        let startDate, endDate
        if (dateRangeValue) {
            [ startDate, endDate ] = dateRangeValue.split('_')
        }
        
        const result = await listDreamlinOrders({ platformSupplierId, startDate, endDate })
        setTotalPrice(getTotalPrice(result))
        setDataSource(result)
    }

    useEffect(() => {
        query()
    }, [ platformSupplierId, dateRangeValue ])

    /* ******************************* 平台 **************************************** */
    const [ platformOptions, setPlatformOptions ] = useState([])

    const queryDicts = async () => {
        const result = await listDicts()
        const options = result.find(item => item.code === 'DY_PLATFORM')?.children?.map(item => ({ value: item.code, label: item.name }))
        setPlatformOptions(options)
    }

    useEffect(() => {
        queryDicts()
    }, [])

    /* ******************************* 供应商 **************************************** */
    const [ supplierOptions, setSupplierOptions ] = useState([])
    const [ supplierDataSource, setSupplierDataSource ] = useState<{id: string; name: string; code: string; remark?: string;}[]>([])

    const querySuppliers = async () => {
        const result = await listDreamlinSuppliers({})
        setSupplierDataSource(result)
        setSupplierOptions(result.map(r => ({ value: r.id, label: r.name })))
    }

    useEffect(() => {
        querySuppliers()
    }, [])

    /* ******************************* 模态框相关 **************************************** */
    const [ form ] = Form.useForm()
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ operateType, setOperateType ] = useState('create')

    const showModal = (record?: DataType) => {
        setOperateType(record ? 'modify' : 'create')
        if (record) {
            form.setFieldsValue({
                ...record,
                occur_date: dayjs(record?.occur_date || new Date().toISOString().slice(0,10), 'YYYY-MM-DD'),
            })
        } else {
            form.resetFields()
            form.setFieldsValue({
                occur_date: dayjs(new Date().toISOString().slice(0,10), 'YYYY-MM-DD'),
            })
        }
        setIsModalOpen(true)
    }

    const handleOk = async () => {
        const values = form.getFieldsValue()
        values.occur_date = dayjs(values.occur_date).format('YYYY-MM-DD')
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
            <Flex justifyContent="flex-end" alignItems="center">
                <DateRange 
                    onChange={value => {
                        setDateRangeValue(value)
                    }}
                />
                <Box width={10} />
                <Select 
                    options={supplierOptions}
                    value={platformSupplierId}
                    onChange={value => setPlatformSupplierId(value)}
                    placeholder="请选择供应商"
                    allowClear
                    showSearch
                    filterOption={(input, option: any) => (option?.label ?? '').includes(input)}
                    style={{ width: 250 }}
                />
                <Box width={10} />
                总差价: {totalPrice}
                <Flex1 />
                <Button type="primary" onClick={() => showModal()}>新增</Button>
            </Flex>
            <Box height={20} />
            <Table
                dataSource={dataSource}
                columns={columns}
                bordered
                scroll={{ x: 1000 }}
                rowKey={record => record.id}
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
                        <DatePicker allowClear={false} />
                    </Form.Item>

                    <Form.Item
                        label="平台名称"
                        name="platform_name"
                        rules={[ { required: true, message: '请选择平台名称!' } ]}
                    >
                        <Select 
                            options={platformOptions}
                            placeholder="请选择平台名称!"
                        />
                    </Form.Item>

                    <Form.Item
                        label="平台价格"
                        name="platform_price"
                        rules={[ { required: true, message: '请输入价格!' } ]}
                    >
                        <InputNumber />
                    </Form.Item>

                    <Form.Item
                        label="平台订单号"
                        name="platform_order_number"
                        rules={[ { required: true, message: '请输入订单号!' } ]}
                    >
                        <Input placeholder="请输入订单号!" />
                    </Form.Item>

                    <Form.Item
                        label="平台供应商"
                        name="platform_supplier_id"
                        rules={[ { message: '请选择供应商!' } ]}
                    >
                        <Select 
                            options={supplierOptions}
                        />
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
