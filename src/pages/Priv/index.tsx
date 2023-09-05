import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Form, Input, Typography, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { createPriv, listPrivs, modifyPriv, removePriv } from 'apis'
import { Box, Flex } from 'druikit';

interface DataType {
    id: string;
    name: string;
    description?: string;
}

const Page = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: '权限名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '权限描述',
            dataIndex: 'description',
            key: 'description',
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
                        onConfirm={async () => await onRemove(record.name)}
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
        const result = await listPrivs()
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
        form.setFieldsValue(record)
        setIsModalOpen(true)
    }

    const handleOk = async () => {
        const values = form.getFieldsValue()
        if (operateType === 'create') {
            await createPriv(values.name, values.description)
        } else {
            await modifyPriv(values.name, values.description)
        }
        setIsModalOpen(false)
        form.resetFields()
        query()
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const onRemove = async (name: string) => {
        await removePriv(name)
        await query()
    }

    return (
        <>
            <Typography.Title level={3}>权限管理</Typography.Title>
            <Flex justifyContent="flex-end">
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
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="权限名称"
                        name="name"
                        rules={[ { required: true, message: '请输入权限名称!' } ]}
                    >
                        <Input disabled={operateType==='modify'} />
                    </Form.Item>

                    <Form.Item
                        label="权限描述"
                        name="description"
                        rules={[ { required: true, message: '请输入权限描述!' } ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default Page
