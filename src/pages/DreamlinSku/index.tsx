import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Form, Input, Typography, Popconfirm, Select, Tooltip, Image, Tag, InputNumber } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Box, Flex, Flex1 } from 'druikit';
import { createDreamlinGood, createDreamlinSku, listDreamlinGoods, listDreamlinSkus, modifyDreamlinGood, modifyDreamlinSku, removeDreamlinGood } from 'apis';

interface DataType {
    id: string;
    good_id: string;
    name: string;
    cost_price: number;
    sale_price: number;
    pinduoduo_price?: number;
    douyin_price?: number;
    status: string;
    remark?: string;
}

const statusOptions = [
    { value: 'on sale', label: '在售' },
    { value: 'sold out', label: '下架' },
]

const Page = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: '商品信息',
            dataIndex: 'good_id',
            key: 'good_id',
            width: 400,
            render(value, record, index) {
                const good = goodDataSource.find(item => item.id === value)
                return (
                    <Space direction="horizontal" style={{ width: '100%' }}>
                        <Image src={good.thumbnail} width={100} preview></Image>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Tooltip>
                                <Typography.Text copyable>{good.name}</Typography.Text>
                            </Tooltip>
                            <Tooltip>
                                <Typography.Text copyable>{good.code}</Typography.Text>
                            </Tooltip>
                        </Space>
                    </Space>
                )
            },
        },
        {
            title: 'sku 名称',
            dataIndex: 'name',
            key: 'name',
            width: 120,
            render(value, record, index) {
                return (
                    <Tooltip title={value}>
                        <Typography.Text>{value}</Typography.Text>
                    </Tooltip>
                )
            },
        },
        {
            title: '成本价/售价',
            dataIndex: 'cost_price',
            key: 'cost_price',
            width: 200,
            render(value, record, index) {
                const rate = record.cost_price === 0 ? 0 : (record.sale_price - record.cost_price) / record.cost_price * 100
                return (
                    <Space direction="vertical">
                        <Typography.Text>成本价: <Tag color="orange">{record.cost_price}</Tag></Typography.Text>
                        <Typography.Text>售价: <Tag color="blue">{record.sale_price}</Tag></Typography.Text>
                        <Typography.Text>价格涨幅: <Tag color="green">{rate.toFixed(1)}%</Tag></Typography.Text>
                    </Space>
                )                
            },
        },
        {
            title: '其它平台价格',
            dataIndex: 'other_price',
            key: 'other_price',
            width: 200,
            render(value, record, index) {
                return (
                    <Space direction="vertical">
                        <Typography.Text>拼多多价格: <Tag>{record.pinduoduo_price}</Tag></Typography.Text>
                        <Typography.Text>抖音平台价格: <Tag>{record.douyin_price}</Tag></Typography.Text>
                    </Space>
                )                
            },
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 70,
            render(value, record, index) {
                if (value === 'on sale') {
                    return <Tag color="blue" >在售</Tag>
                }
                if (value === 'sold out') {
                    return <Tag color="orange">下架</Tag>
                }
                return <Tag>未知</Tag>
            },
        },
        {
            title: '商品备注',
            dataIndex: 'remark',
            key: 'remark',
            width: 100,
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => showModal(record)}>编辑</Button>
                </Space>
            ),
        },
    ]

    const [ goodDataSource, setGoodDataSource ] = useState<any[]>([])
    const [ goodOptions, setGoodOptions ] = useState([])

    useEffect(() => {
        listDreamlinGoods()
            .then(result => {
                setGoodDataSource(result)
                setGoodOptions(result.map(item => ({ label: item.name, value: item.id })))
            })
    }, [])

    const [ dataSource, setDataSource ] = useState<DataType[]>([]) 

    const query = async () => {
        const result = await listDreamlinSkus()
        setDataSource(result)
    }

    useEffect(() => {
        query()
    }, [ ])

    /* ******************************* 模态框相关 **************************************** */
    const [ form ] = Form.useForm()
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ operateType, setOperateType ] = useState('create')

    const showModal = (record?: DataType) => {
        setOperateType(record ? 'modify' : 'create')
        if (record) {
            form.setFieldsValue(record)
        } else {
            form.resetFields()
            form.setFieldsValue({ status: 'on sale' })
        }
        setIsModalOpen(true)
    }

    const handleOk = async () => {
        const values = form.getFieldsValue()
        if (operateType === 'create') {
            await createDreamlinSku(values)
        } else {
            await modifyDreamlinSku({
                ...values,
                pinduoduo_price: !values.pinduoduo_price ? undefined : values.pinduoduo_price,
                douyin_price: !values.douyin_price ? undefined : values.douyin_price,
            })
        }
        setIsModalOpen(false)
        form.resetFields()
        query()
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    return (
        <>
            <Typography.Title level={3}>梦林的 SKU 管理</Typography.Title>
            <Flex justifyContent="flex-end">
                {/* <Input.Search
                    placeholder="根据供应商名称模糊查询" 
                    style={{ width: '250px' }}
                    onSearch={value => {
                        setName(value)
                    }}
                />
                <Box width={10} />
                <Input.Search
                    placeholder="根据供应商ID模糊查询" 
                    style={{ width: '250px' }}
                    onSearch={value => {
                        setCode(value)
                    }}
                /> */}
                <Flex1 />
                <Button type="primary" onClick={() => showModal()}>新增</Button>
            </Flex>
            <Box height={20} />
            <Table
                dataSource={dataSource}
                columns={columns}
                bordered
                rowKey={record => record.id}
            />
            <Modal title="SKU 操作" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    name="basic"
                    form={form}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
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
                        label="商品"
                        name="good_id"
                        rules={[ { required: true, message: '请选择商品ID!' } ]}
                    >
                        <Select options={goodOptions} />
                    </Form.Item>

                    <Form.Item
                        label="SKU 名称"
                        name="name"
                        rules={[ { required: true, message: '请输入商品名称!' } ]}
                    >
                        <Input.TextArea autoSize placeholder="请输入" />
                    </Form.Item>

                    <Form.Item
                        label="成本价"
                        name="cost_price"
                        rules={[ { required: true, message: '请输入成本价!' } ]}
                    >
                        <InputNumber placeholder="请输入" />
                    </Form.Item>

                    <Form.Item
                        label="售价"
                        name="sale_price"
                        rules={[ { required: true, message: '请输入售价价!' } ]}
                    >
                        <InputNumber placeholder="请输入" />
                    </Form.Item>

                    <Form.Item
                        label="拼多多价格"
                        name="pinduoduo_price"
                        rules={[ { message: '请输入拼多多价格!' } ]}
                    >
                        <InputNumber placeholder="请输入" />
                    </Form.Item>

                    <Form.Item
                        label="抖音平台价格"
                        name="douyin_price"
                        rules={[ { message: '请输入抖音平台价格!' } ]}
                    >
                        <InputNumber placeholder="请输入" />
                    </Form.Item>

                    <Form.Item
                        label="状态"
                        name="status"
                        rules={[ { required: true, message: '请选择!' } ]}
                    >
                        <Select 
                            options={statusOptions}
                        />
                    </Form.Item>

                    <Form.Item
                        label="备注"
                        name="remark"
                        rules={[ { message: '请输入供应商备注!' } ]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>

                    <Form.Item
                        label="发布日期"
                        name="launch_date"
                        rules={[ { message: '请输入发布日期!' } ]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default Page
