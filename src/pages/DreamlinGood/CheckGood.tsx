import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Form, Input, Typography, Select, Tooltip, Image, Tag, Descriptions } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Box, Flex, Flex1, InfoCircleOutlined } from 'druikit';
import { createDreamlinGood, listDreamlinGoods, modifyDreamlinGood } from 'apis';
import { useDreamlinGoodApiData } from './hook';
import { useDreamlinGoodPageData } from 'store/pageDataSlice.hook';

interface DataType {
    id: string;
    name: string;
    cost_price: number;
    sale_price: number;
    pinduoduo_price?: number;
    douyin_price?: number;
    goodThumbnail?: string;
    goodName?: string;
    goodCode?: string;
}

const statusOptions = [
    { value: 'on sale', label: '在售' },
    { value: 'sold out', label: '下架' },
]

const getRate = (record) => {
    return record.cost_price === 0 ? 0 : (record.sale_price - record.cost_price) / record.cost_price * 100
}

const Page = () => {
    const { fetchDreamlinGoods } = useDreamlinGoodApiData()
    const [ pageData ] = useDreamlinGoodPageData()
    const {
        skusData: dataSource = [],
    } = pageData

    const columns: ColumnsType<DataType> = [
        {
            title: '商品信息',
            dataIndex: 'good_id',
            key: 'good_id',
            width: 400,
            render(value, record, index) {
                return (
                    <Space direction="horizontal" style={{ width: '100%' }}>
                        <Image src={record.goodThumbnail} width={100} preview></Image>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Tooltip>
                                <Typography.Text copyable>{record.goodName}</Typography.Text>
                            </Tooltip>
                            <Tooltip>
                                <Typography.Text copyable>{record.goodCode}</Typography.Text>
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
                        <Typography.Text copyable>{value}</Typography.Text>
                    </Tooltip>
                )
            },
        },
        {
            title: (
                <Space>
                    <Typography.Text>成本价/售价</Typography.Text>
                    <small>(根据涨幅比率排序)</small>
                </Space>
            ),
            dataIndex: 'cost_price',
            key: 'cost_price',
            width: 300,
            sorter: (a, b) => (getRate(a)) - (getRate(b)),
            render(value, record, index) {
                const rate = getRate(record)
                return (
                    <Descriptions 
                        column={2} 
                        bordered
                        size="small" 
                        labelStyle={{ padding: 4, border: 'none' }} 
                        contentStyle={{ padding: 4, border: 'none' }}
                    >
                        <Descriptions.Item label="成本价"><Tag color="orange">{record.cost_price}</Tag></Descriptions.Item>
                        <Descriptions.Item label="售价"><Tag color="blue">{record.sale_price}</Tag></Descriptions.Item>
                        <Descriptions.Item label="涨幅"><Tag color="green">{Number(record.sale_price - record.cost_price).toFixed(2)}</Tag></Descriptions.Item>
                        <Descriptions.Item label="涨幅比率"><Tag color="green">{rate.toFixed(1)}%</Tag></Descriptions.Item>
                    </Descriptions>
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
        // {
        //     title: '操作',
        //     key: 'action',
        //     align: 'center',
        //     render: (_, record) => (
        //         <Space size="middle">
        //             <Button type="link" onClick={() => showModal(record)}>编辑</Button>
        //         </Space>
        //     ),
        // },
    ]

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
            await createDreamlinGood(values)
        } else {
            await modifyDreamlinGood(values)
        }
        setIsModalOpen(false)
        form.resetFields()
        fetchDreamlinGoods()
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    return (
        <>
            {/* <Flex justifyContent="flex-end">
                <Flex1 />
                <Button type="primary" onClick={() => showModal()}>新增</Button>
            </Flex> */}
            <Box height={20} />
            <Table
                dataSource={dataSource}
                columns={columns}
                bordered
                rowKey={record => record.id}
            />
            <Modal title="商品操作" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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
                        label="商品ID"
                        name="code"
                        rules={[ { required: true, message: '请输入商品ID!' } ]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>

                    <Form.Item
                        label="商品名称"
                        name="name"
                        rules={[ { required: true, message: '请输入商品名称!' } ]}
                    >
                        <Input.TextArea autoSize placeholder="请输入" />
                    </Form.Item>

                    <Form.Item
                        label="商品缩略图"
                        name="thumbnail"
                        rules={[ { required: true, message: '请输入商品缩略图!' } ]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>

                    <Form.Item
                        label="商品状态"
                        name="status"
                        rules={[ { required: true, message: '请选择!' } ]}
                    >
                        <Select 
                            options={statusOptions}
                        />
                    </Form.Item>

                    <Form.Item
                        label="供应商备注"
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
