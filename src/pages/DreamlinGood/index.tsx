import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Form, Input, Typography, Popconfirm, Select, Tooltip, Image, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Box, Flex, Flex1 } from 'druikit';
import { createDreamlinGood, listDreamlinGoods, modifyDreamlinGood, removeDreamlinGood } from 'apis';

interface DataType {
    id: string;
    code: string;
    name: string;
    thumbnail: string;
    status: string;
    remark?: string;
    launch_date?: string;
}

const statusOptions = [
    { value: 'on sale', label: '在售' },
    { value: 'sold out', label: '下架' },
]

const Page = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: '商品图片',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            render(value, record, index) {
                return (
                    <Image src={value} preview width={100} />
                )
            },
        },
        {
            title: '商品名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            render(value, record, index) {
                return (
                    <Tooltip title={value}>
                        <Typography.Text ellipsis copyable>{value}</Typography.Text>
                    </Tooltip>
                )
            },
        },
        {
            title: '商品ID',
            dataIndex: 'code',
            key: 'code',
            render(value, record, index) {
                return (
                    <Tooltip title={value}>
                        <Typography.Text ellipsis copyable>{value}</Typography.Text>
                    </Tooltip>
                )
            },
        },
        {
            title: '商品状态',
            dataIndex: 'status',
            key: 'status',
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
            title: '发布日期',
            dataIndex: 'launch_date',
            key: 'launch_date',
        },
        {
            title: '商品备注',
            dataIndex: 'remark',
            key: 'remark',
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

    const [ dataSource, setDataSource ] = useState<DataType[]>([]) 

    const query = async () => {
        const result = await listDreamlinGoods()
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
            await createDreamlinGood(values)
        } else {
            await modifyDreamlinGood(values)
        }
        setIsModalOpen(false)
        form.resetFields()
        query()
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const onRemove = async (id: string) => {
        await removeDreamlinGood(id)
        await query()
    }

    return (
        <>
            <Typography.Title level={3}>梦林的商品管理</Typography.Title>
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
            />
            <Modal title="权限操作" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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
