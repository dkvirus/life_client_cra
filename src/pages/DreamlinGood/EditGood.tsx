import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, Form, Input, Typography, Select, Image, Tag, Row, Col } from 'antd'
import type { ProColumns } from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-components';
import type { ColumnsType } from 'antd/es/table'
import { Box, Flex, Flex1 } from 'druikit';
import { createDreamlinGood, modifyDreamlinGood, modifyDreamlinGoodSkus } from 'apis';
import { useDreamlinGoodPageData } from 'store/pageDataSlice.hook';
import { useDreamlinGoodApiData } from './hook';
import useDeepCompareEffect from 'use-deep-compare-effect';

interface DataType {
    id: string;
    code: string;
    name: string;
    thumbnail: string;
    status: string;
    remark?: string;
    launch_date?: string;
    skus: any[];
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
            width: 400,
            render(value, record, index) {
                return (
                    <Space direction="horizontal">
                        <Image src={value} preview width={100} />
                        <Space direction="vertical">
                            <Typography.Text>商品名: {record.name}</Typography.Text>
                            <Typography.Text>商品编号: {record.code}</Typography.Text>
                            <Typography.Text>
                                商品状态:&nbsp;
                                <Tag color={record.status === 'on sale' ? 'blue' : 'orange'}>{record.status === 'on sale' ? '在售' : '下架'}</Tag>
                            </Typography.Text>
                            <Typography.Text>发布日期: {record.launch_date}</Typography.Text>
                            <Typography.Text>供货商: {record.remark}</Typography.Text>
                        </Space>
                    </Space>
                )
            },
        },
        {
            title: 'Skus',
            width: 400,
            render(value, record, index) {
                return (
                    <>
                        {
                            record?.skus?.length ? (
                                <Row>
                                    <Col span={16}>名称</Col>
                                    <Col span={4}>成本价</Col>
                                    <Col span={4}>售价</Col>
                                </Row>
                            ) : null
                        }
                        {
                            record?.skus?.map(item => {
                                return (
                                    <Row key={item.id}>
                                        <Col span={16}>{item.name}</Col>
                                        <Col span={4}>{item.cost_price}</Col>
                                        <Col span={4}>{item.sale_price}</Col>
                                    </Row>
                                )
                            })
                        }
                    </>
                )
            },
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => showModal(record)}>编辑商品</Button>
                    <Button type="link" onClick={() => onShowSkuModal(record)}>编辑 sku</Button>
                </Space>
            ),
        },
    ]

    const { fetchDreamlinGoods } = useDreamlinGoodApiData()
    const [ pageData ] = useDreamlinGoodPageData()
    const {
        apiData: dataSource,
    } = pageData

    const [ keyword, setKeyword ] = useState('')

    useEffect(() => {
        fetchDreamlinGoods(keyword)
    }, [ keyword ])

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
        fetchDreamlinGoods(keyword)
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    /* ******************************* SKU 模态框相关 **************************************** */
    const [ skuModalVisible, setSkuModalVisible ] = useState(false)
    const [ skuModalRecord, setSkuModalRecord ] = useState<any>({})

    const onShowSkuModal = (record) => {
        setSkuModalVisible(true)
        setSkuModalRecord(record)
    }

    return (
        <>
            <Flex justifyContent="flex-end">
                <Input.Search
                    placeholder="根据商品名称或者编号" 
                    style={{ width: '250px' }}
                    onSearch={value => {
                        setKeyword(value)
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
            {
                skuModalVisible ? (
                    <SkuModal 
                        onCancel={() => setSkuModalVisible(false)}
                        onOk={() => fetchDreamlinGoods(keyword)}
                        record={skuModalRecord}
                    />
                ) : null
            }
        </>
    )
}

type DataSourceType = {
    id: React.Key;
    name?: string;
    cost_price?: string;
    sale_price?: string;
    pinduoduo_price?: string;
    douyin_price?: number;
}

const SkuModal = ({
    onCancel,
    onOk,
    record,
}) => {
    const [ editableKeys, setEditableRowKeys ] = useState<React.Key[]>([])
    const [ dataSource, setDataSource ] = useState<readonly DataSourceType[]>([])

    useDeepCompareEffect(() => {
        setDataSource(record?.skus || [])
    }, [ record ])

    const columns: ProColumns<DataSourceType>[] = [
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '成本价',
            dataIndex: 'cost_price',
            valueType: 'digit',
        },
        {
            title: '售价',
            dataIndex: 'sale_price',
            valueType: 'digit',
        },
        {
            title: '拼多多价格',
            dataIndex: 'pinduoduo_price',
            valueType: 'digit',
        },
        {
            title: '抖音平台价格',
            dataIndex: 'douyin_price',
            valueType: 'digit',
        },
        {
            title: '操作',
            valueType: 'option',
            width: 200,
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.id);
                    }}
                >
                    编辑
                </a>,
                <a
                    key="delete"
                    onClick={() => {
                        setDataSource(dataSource.filter((item) => item.id !== record.id));
                    }}
                >
                    删除
                </a>,
            ],
        },
    ]

    const onSubmit = async () => {
        const data = dataSource.map(d => ({
            id: d.id,
            name: d.name,
            cost_price: d.cost_price,
            sale_price: d.sale_price,
            pinduoduo_price: d.pinduoduo_price,
            douyin_price: d.douyin_price,
        }))
        await modifyDreamlinGoodSkus(record.id, data)
        onCancel()
        onOk()
    }

    return (
        <Modal
            title="SKU"
            onCancel={onCancel}
            onOk={onSubmit}
            open={true}
            width="80%"
        >
            <EditableProTable
                rowKey="id"
                maxLength={5}
                loading={false}
                columns={columns}
                value={dataSource}
                onChange={(data) => {
                    setDataSource(data)
                }}
                recordCreatorProps={{
                    position: 'top',
                    record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
                }}
                editable={{
                    type: 'multiple',
                    editableKeys,
                    onChange: setEditableRowKeys,
                }}
            />
        </Modal>
    );
}

export default Page
