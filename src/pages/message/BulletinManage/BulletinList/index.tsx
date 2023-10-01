import React, { useRef, useState } from "react";
import { addBulletin, deleteBulletin, queryBulletin, queryBulletinPageList } from "@/services/api/message/bulletin";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import ProTable, { ActionType, ProColumns } from "@ant-design/pro-table";
import { Button, Divider, Drawer, Dropdown, Menu, Space, Spin, Typography, message } from "antd";
import CreateForm from "../components/CreateForm";
import {useAccess, Access} from 'umi';
import { Confirm } from '@/utils/confirm';

const BulletinList: React.FC = () => {
    const access = useAccess();
    const actionRef = useRef<ActionType>();
    const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
    const [currentDetail, setCurrentDetail] = useState<API.BulletinListItem | null>(null);
    const [showDetailLodding, setShowDetailLodding] = useState<boolean>(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [currentRecord, setCurrentRecord] = useState<API.BulletinListItem>();
    const { Title, Paragraph } = Typography;
    /** 公告列表查询 */
    const queryBulletinList = async (params: API.PageParams, sorter: any, filter: any) => {
        const result = await queryBulletinPageList({ ...params, ...sorter, ...filter });
        return result.data;
    }
    /** 公告详情查询 */
    const queryBulletinDetail = async (id: number) => {
        setShowDetailLodding(true);
        if (id) {
            const result = await queryBulletin(id);
            setShowDetailLodding(false);
            setCurrentDetail(result.data);
        }
    }
    /** 公告新增 */
    const handleAdd = async (value: { title: string, content: string }) => {
        const result = await addBulletin(value);
        if (result.success) {
            message.success('添加成功');
            return true;
        }
        message.error(result.data.errorMessage);
        return false;
    }

  /** 公告删除 */
  const handleDelete = async () => {
    if (currentRecord) {
      await deleteBulletin(currentRecord.id);
      message.success('公告删除完成');
      actionRef.current?.reload();
    }
  }

    /** 操作菜单 */
    const optionMenu = (
        <Menu>
            {access.userEnable && <Menu.Item key="delete">
                <span
                    key="delete"
                    onClick={() => {
                        Confirm({
                            needCheck: false,
                            confirmContent: '确认要删除所选公告吗？',
                            onOk: handleDelete
                        });
                    }}
                >
                    删除
                </span>
            </Menu.Item>}
        </Menu>
    );
    const columns: ProColumns<API.BulletinListItem>[] = [
        {
            title: '标题',
            dataIndex: 'title',
            search: false,
            render: (dom, record) => {
                return (
                    <a
                        onClick={() => {
                            queryBulletinDetail(record.id);
                            setShowDetail(true);
                        }}
                    >
                        {dom}
                    </a>
                );
            },
        },
        {
            title: '内容',
            dataIndex: 'content',
            search: false,
        },
        {
            title: '创建人',
            dataIndex: 'createBy',
            search: false,
            sorter: true
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            search: false,
            sorter: true
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
                <a
                    key="details"
                    onClick={() => {
                        queryBulletinDetail(record.id);
                        setShowDetail(true);
                    }}
                >
                    详情
                </a>,
                <Access
                    key={"more"}
                    accessible={access.roleSetting || access.userEnable || access.userDisable}
                >
                    <Dropdown
                        key="more"
                        overlay={optionMenu}
                        onVisibleChange={
                            (visible: boolean) => {
                                if (visible) {
                                    setCurrentRecord(record);
                                }
                            }
                        }>
                        <a
                            className="ant-dropdown-link"
                            onClick={e => e.preventDefault()}>
                            更多&nbsp;<DownOutlined />
                        </a>
                    </Dropdown>
                </Access>
            ],
        },
    ];
    return (
        <PageContainer>
            <ProTable<API.BulletinListItem, API.PageParams>
                headerTitle="公告列表"
                rowKey="id"
                search={false}
                actionRef={actionRef}
                request={queryBulletinList}
                columns={columns}
                rowSelection={{
                    onChange: (_, selectedRows: API.BulletinListItem[]) => {

                    },
                }}
                toolBarRender={() => [
                    <Access
                        key={"bulletinAdd"}
                        accessible={access.bulletinAdd}
                    >
                        <Button
                            type="primary"
                            key="primary"
                            onClick={() => {
                                handleCreateModalVisible(true);
                            }}
                        >
                            <PlusOutlined />新建
                        </Button>
                    </Access>,
                ]}
            />
            <CreateForm
                key="create"
                modalVisible={createModalVisible}
                onCancel={() => {
                    handleCreateModalVisible(false);
                    setCurrentRecord(undefined);
                }}
                onSubmit={async (value: Record<string, any>) => {
                    const success = await handleAdd({ title: value.title, content: value.content });
                    if (success) {
                        handleCreateModalVisible(false);
                        setCurrentRecord(undefined);
                        if (success) {
                            if (actionRef.current) {
                                actionRef.current.reload();
                            }
                        }
                    }
                }}
            />
            <Drawer
                width={800}
                visible={showDetail}
                onClose={() => {
                    setShowDetail(false);
                    setCurrentDetail(null);
                }}
                closable={true}
            >
                <Spin spinning={showDetailLodding} >
                    <Typography>
                        <div>
                            <Title level={4}>{currentDetail?.title}</Title>
                            <Space size={5} style={{ fontSize: 16, color: '#000000A6' }}><span>{currentDetail?.createBy}</span><span>•</span><span>{currentDetail?.createTime}</span></Space>
                        </div>
                        <Divider />
                        <div dangerouslySetInnerHTML={{ __html: currentDetail?.content ?? '' }}></div>
                    </Typography>
                </Spin>
            </Drawer>
        </PageContainer>
    );
}
export default BulletinList;