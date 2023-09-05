import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, Form, Input, Typography, Select, Tag, DatePicker, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { createUser, listRoles, listUsers, modifyUser, modifyUserPassword } from 'apis';
import { OperateTypeEnum } from 'types';
import dayjs from 'dayjs'
import { Box, Flex } from 'druikit';

interface DataType {
    username: string;
    createDate: string;
    endDate: string;
}

const Page = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: '用户名称',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '创建日期',
            dataIndex: 'createDate',
            key: 'createDate',
        },
        {
            title: '到期日期',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: '关联角色',
            dataIndex: 'roles',
            key: 'roles',
            render(value) {
                return (
                    <Space>
                        {
                            value.map((v: string) => (
                                <Tag key={v}>
                                    {roleList?.find(p => p.name === v)?.description}
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
                    <Button type="link" onClick={() => onShowModal(record)}>编辑</Button>
                    <Button type="link" onClick={() => onShowPasswordModal(record)}>修改密码</Button>
                </Space>
            ),
        },
    ]

    const [ roleList, setRoleList ] = useState<{name: string; description: string; privs: string[]}[]>([])
    const [ dataSource, setDataSource ] = useState<DataType[]>([])

    const queryUsers = async () => {
        const result = await listUsers()
        setDataSource(result.map((item: any) => ({ ...item, endDate: item.end_date, createDate: item.create_date })))
    }

    const queryRoles = async () => {
        const result = await listRoles()
        setRoleList(result)
    }

    useEffect(() => {
        queryUsers()
        queryRoles()
    }, [])

    /* ******************************* 模态框相关 **************************************** */
    const [ form ] = Form.useForm()
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ operateType, setOperateType ] = useState<OperateTypeEnum>(OperateTypeEnum.create)

    const onShowModal = (record?: DataType) => {
        setOperateType(record ? OperateTypeEnum.modify : OperateTypeEnum.create)
        setIsModalOpen(true)
        if (record) {
            form.setFieldsValue({ 
                ...record, 
                endDate: dayjs(record?.endDate, 'YYYY-MM-DD'),
                createDate: dayjs(record?.createDate, 'YYYY-MM-DD'),
            })
        } else {
            form.resetFields()
        }
    }

    const handleOk = async () => {
        const values = form.getFieldsValue()
        // 编辑
        if (operateType === OperateTypeEnum.modify) {
            const endDate = dayjs(values.endDate).format('YYYY-MM-DD')
            await modifyUser(values.username, endDate, values.roles)
        }
        // 新增
        else {
            await createUser(values.username)
        }
        form.resetFields()
        setIsModalOpen(false)
        queryUsers()
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    /* ******************************* 修改密码模态框 **************************************** */
    const [ pwdForm ] = Form.useForm()
    const [ isPwdModalOpen, setIsPwdModalOpen ] = useState(false)
    const [ operateRow, setOperateRow ] = useState<DataType>()

    const onShowPasswordModal = (record: DataType) => {
        setIsPwdModalOpen(true)
        setOperateRow(record)
        pwdForm.resetFields()
    }

    const onCancelPwdModal = () => {
        setIsPwdModalOpen(false)
    }

    const onOkPwdModal = async () => {
        if (!operateRow?.username) return
        const values = pwdForm.getFieldsValue()
        await modifyUserPassword(operateRow.username, values.password)
        message.success('修改密码成功')
        onCancelPwdModal()
    }

    return (
        <>
            <Typography.Title level={3}>用户管理</Typography.Title>
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
                title="修改密码" 
                open={isPwdModalOpen} 
                onOk={onOkPwdModal} 
                onCancel={onCancelPwdModal}
                width={600}
            >
                <Box height={30} />
                <Form
                    name="basic"
                    form={pwdForm}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="新密码"
                        name="password"
                        rules={[ { required: true, message: '请输入新密码!' } ]}
                    >
                        <Input placeholder="请输入新密码" />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal 
                title="用户操作" 
                open={isModalOpen} 
                onOk={handleOk} 
                onCancel={handleCancel}
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
                        label="用户名称"
                        name="username"
                        rules={[ { required: true, message: '请输入用户名称!' } ]}
                    >
                        <Input 
                            disabled={operateType === OperateTypeEnum.modify} 
                            bordered={operateType !== OperateTypeEnum.modify} 
                        />
                    </Form.Item>

                    {
                        operateType === OperateTypeEnum.modify ? (
                            <>
                                <Form.Item
                                    label="创建日期"
                                    name="createDate"
                                >
                                    <DatePicker
                                        disabled={true} 
                                        bordered={false} 
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="到期日期"
                                    name="endDate"
                                >
                                    <DatePicker />
                                </Form.Item>

                                <Form.Item
                                    label="角色列表"
                                    name="roles"
                                    rules={[ { required: true, message: '请选择关联角色!' } ]}
                                >
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        options={roleList}
                                        fieldNames={{ label: 'description', value: 'name' }}
                                    />
                                </Form.Item>
                            </>
                        ) : null
                    }
                </Form>
            </Modal>
        </>
    )
}

export default Page
