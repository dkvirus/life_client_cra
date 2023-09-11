import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Form, Input, Typography, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { createDreamlinSupplier, createPriv, listDreamlinSuppliers, listPrivs, modifyDreamlinSupplier, modifyPriv, removeDreamlinSupplier, removePriv } from 'apis'
import { Box, Flex, Flex1 } from 'druikit';

interface DataType {
    id: string;
    name: string;
    code: string;
    remark?: string;
}

const Page = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: '供应商名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '供应商ID',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '供应商备注',
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
    const [ code, setCode ] = useState('')
    const [ name, setName ] = useState('')

    const query = async () => {
        const result = await listDreamlinSuppliers({ name, code })
        setDataSource(result)
    }

    useEffect(() => {
        query()
    }, [ name, code ])

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
        }
        setIsModalOpen(true)
    }

    const handleOk = async () => {
        const values = form.getFieldsValue()
        if (operateType === 'create') {
            await createDreamlinSupplier(values)
        } else {
            await modifyDreamlinSupplier(values)
        }
        setIsModalOpen(false)
        form.resetFields()
        query()
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const onRemove = async (id: string) => {
        await removeDreamlinSupplier(id)
        await query()
    }

    return (
        <>
            <Typography.Title level={3}>梦林的供应商管理</Typography.Title>
            <Flex justifyContent="flex-end">
                <Input.Search
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
                />
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
                        label="供应商名称"
                        name="name"
                        rules={[ { required: true, message: '请输入供应商名称!' } ]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>

                    <Form.Item
                        label="供应商ID"
                        name="code"
                        rules={[ { required: true, message: '请输入供应商ID!' } ]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>

                    <Form.Item
                        label="供应商备注"
                        name="remark"
                        rules={[ { message: '请输入供应商备注!' } ]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default Page
