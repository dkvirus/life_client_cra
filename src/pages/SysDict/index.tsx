import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Form, Input, Typography, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { createDict, listDicts, modifyDict, removeDict } from 'apis'
import { Box, Flex, Flex1 } from 'druikit';

interface DataType {
    name: string;
    code: string;
    children?: DataType[];
}

const Page = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: '字典值',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '字典描述',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (_, record) => {
                const isParent = Array.isArray(record.children)
                return (
                    <Space size="middle" onClick={e => e.stopPropagation()}>
                        <Popconfirm
                            title="删除"
                            description="确认删除这条数据吗?"
                            onConfirm={async () => {
                                await onRemove(isParent ? 'parent' : 'child', record.code)
                            }}
                            okText="删除"
                            cancelText="取消"
                        >
                            <Button type="link" danger>删除</Button>
                        </Popconfirm>
                        <Button 
                            type="link" 
                            onClick={() => {
                                showModal(isParent ? 'parent' : 'child', 'modify', record)
                            }}
                        >
                            编辑
                        </Button>
                        {
                            isParent ? (
                                <Button
                                    type="link"
                                    onClick={() => {
                                        setOperateParentRecord(record)
                                        showModal('child', 'create', record)
                                    }}
                                >
                                    新增
                                </Button>
                            ) : null
                        }
                    </Space>
                )
            },
        },
    ]

    const [ dataSource, setDataSource ] = useState<DataType[]>([]) 
    const [ expandedRowKeys, setExpandedRowKeys ] = useState<string[]>([])

    const query = async () => {
        const result = await listDicts()
        setDataSource(result)
    }

    useEffect(() => {
        query()
    }, [])

    /* ******************************* 模态框相关 **************************************** */
    const [ form ] = Form.useForm()
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ operateType, setOperateType ] = useState('create')
    const [ operateLevel, setOperateLevel ] = useState<'parent' | 'child'>('parent')
    const [ operateRecord, setOperateRecord ] = useState<DataType>()
    const [ operateParentRecord, setOperateParentRecord ] = useState<DataType>()

    const showModal = (operateLevel: 'parent' | 'child', operateType: 'modify' | 'create', record?: DataType) => {
        if (operateType === 'modify') {
            form.setFieldsValue(record)
        } else {
            form.resetFields()
        }
        setOperateType(operateType)
        setOperateLevel(operateLevel)
        setOperateRecord(record)
        setIsModalOpen(true)
    }

    const handleOk = async () => {
        const values = form.getFieldsValue()
        if (operateLevel === 'parent') {
            if (operateType === 'create') {
                await createDict(values)
            } else {
                await modifyDict({ ...operateRecord, name: values.name })
            }
        } else {
            const newOperateParentRecord = JSON.parse(JSON.stringify(operateParentRecord))
            if (operateType === 'create') {
                newOperateParentRecord?.children?.push(values)
            } else {
                newOperateParentRecord.children = newOperateParentRecord?.children?.map(item => {
                    if (item.code === values.code) return values
                    return item
                })
            }
            await modifyDict(newOperateParentRecord)
        }
        setIsModalOpen(false)
        query()
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const onRemove = async (operateLevel, code: string) => {
        if (operateLevel === 'child' && operateParentRecord && Array.isArray(operateParentRecord?.children)) {
            operateParentRecord.children = operateParentRecord.children.filter(item => item.code !== code)
            await modifyDict(operateParentRecord)
        } else {
            await removeDict(code)
        }
        await query()
    }
    
    return (
        <>
            <Typography.Title level={3}>字典管理</Typography.Title>
            <Flex justifyContent="flex-end">
                <Flex1 />
                <Button type="primary" onClick={() => showModal('parent', 'create')}>新增</Button>
            </Flex>
            <Box height={20} />
            <Table
                dataSource={dataSource}
                columns={columns}
                bordered
                rowKey={record => record.code}
                expandable={{
                    expandedRowKeys,
                    onExpand: (expanded, record) => {
                        if (expanded) {
                            setExpandedRowKeys([ record.code ])
                            setOperateParentRecord(record)
                        } else {
                            setExpandedRowKeys([])
                            setOperateParentRecord(undefined)
                        }
                    },
                }}
            />
            <Modal title="字典操作" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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
                        label="字典值"
                        name="code"
                        rules={[ { required: true, message: '请输入字典值!' } ]}
                    >
                        <Input placeholder="请输入" disabled={operateType === 'modify'} />
                    </Form.Item>

                    <Form.Item
                        label="字典描述"
                        name="name"
                        rules={[ { required: true, message: '请输入字典描述!' } ]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default Page
