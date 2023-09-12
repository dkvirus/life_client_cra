import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, Form, Input, Typography, Select, Tag, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { createRole, listPrivs, listRoles, modifyRole, removeRole } from 'apis';
import { Box, Flex } from 'druikit';

interface DataType {
    name: string;
    description: string;
    privs: string[];
}

const Page = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '角色描述',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '关联权限',
            dataIndex: 'privs',
            key: 'privs',
            render(value) {
                return (
                    <Space wrap>
                        {
                            value.map((v: string) => (
                                <Tag key={v}>
                                    {privList?.find(p => p.name === v)?.description}
                                </Tag>
                            ))
                        }                        
                    </Space>
                )
            },
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
                        onConfirm={() => onRemove(record.name)}
                        okText="删除"
                        cancelText="取消"
                    >
                        <Button type="link" danger>删除</Button>
                    </Popconfirm>
                    <Button type="link" onClick={() => onShowModal(record)}>编辑</Button>
                </Space>
            ),
        },
    ]

    const [ privList, setPrivList ] = useState<{name: string; description: string}[]>([])
    const [ dataSource, setDataSource ] = useState<DataType[]>([])

    const queryRoles = async () => {
        const result = await listRoles()
        setDataSource(result)
    }

    const queryPrivs = async () => {
        const result = await listPrivs()
        setPrivList(result)
    }

    useEffect(() => {
        queryRoles()
        queryPrivs()
    }, [])

    /* ******************************* 模态框相关 **************************************** */
    const [ form ] = Form.useForm()
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ operateRow, setOperateRow ] = useState<undefined | DataType>(undefined)

    const onShowModal = (record?: DataType) => {
        setOperateRow(record)
        setIsModalOpen(true)
        form.setFieldsValue(record)
    }

    const onOk = async () => {
        const values = form.getFieldsValue()
        // 编辑
        if (operateRow) {
            await modifyRole(values.name, values.description, values.privs)
        }
        // 新增
        else {
            await createRole(values.name, values.description, values.privs)
        }
        form.resetFields()
        setIsModalOpen(false)
        queryRoles()
    }

    const onRemove = async (name: string) => {
        await removeRole(name)
        queryRoles()
    }

    return (
        <>
            <Typography.Title level={3}>角色管理</Typography.Title>
            <Flex justifyContent="flex-end">
                <Button type="primary" onClick={() => onShowModal()}>新增</Button>
            </Flex>
            <Box height={20} />
            <Table
                dataSource={dataSource}
                columns={columns}
                bordered
            />
            <Modal 
                title="角色操作" 
                open={isModalOpen} 
                onOk={onOk} 
                onCancel={() => setIsModalOpen(false)}
                width={800}
            >
                <Form
                    name="basic"
                    form={form}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 800 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="角色名称"
                        name="name"
                        rules={[ { required: true, message: '请输入角色名称!' } ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="角色描述"
                        name="description"
                        rules={[ { required: true, message: '请输入角色描述!' } ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="权限列表"
                        name="privs"
                        rules={[ { required: true, message: '请选择关联权限!' } ]}
                    >
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            options={privList}
                            fieldNames={{ label: 'description', value: 'name' }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default Page
