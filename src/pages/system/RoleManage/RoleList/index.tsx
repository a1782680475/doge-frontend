import React, {useState, useRef} from 'react';
import ProTable, {ProColumns, ActionType} from '@ant-design/pro-table';
import {Button, Drawer, Dropdown, Menu, message} from 'antd';
import {PageContainer} from '@ant-design/pro-layout';
import {useAccess, Access} from 'umi';
import {
  queryPageList,
  addRole,
  updateRole,
  deleteRole,
  deleteRoleBatch,
  roleAuthorize
} from '@/services/api/system/role';
import {Confirm} from '@/utils/confirm';
import {DownOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import ProDescriptions, {ProDescriptionsItemProps} from "@ant-design/pro-descriptions";
import UpdateForm from "@/pages/system/RoleManage/RoleList/components/UpdateForm";
import CreateForm from './components/CreateForm';
import RoleAuthorize from "@/pages/system/RoleManage/RoleList/components/RoleAuthorize";

const RoleList: React.FC = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.RoleListItem[]>([]);
  const [currentRecord, setCurrentRecord] = useState<API.RoleListItem>();
  const [showDetail, setShowDetail] = useState<boolean>(false);

  /** 新建窗口的弹窗 */
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);

  /** 编辑窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  /** 角色授权的抽屉 */
  const [authorizeDrawerVisible, handleAuthorizeDrawerVisible] = useState<boolean>(false);

  /** 角色列表查询 */
  const queryRoleList = async (params: API.PageParams, sorter: any, filter: any) => {
    const result = await queryPageList({...params, ...sorter, ...filter});
    return result.data;
  }

  /** 角色新增 */
  const handleAdd = async (value: Record<string, any>) => {
    const result = await addRole(value);
    if (result.success) {
      message.success('添加成功');
      return true;
    }
    message.error(result.errorMessage);
    return false;
  }

  /** 角色编辑 */
  const handleUpdate = async (value: Record<string, any>) => {
    const result = await updateRole(value);
    if (result.success) {
      message.success('保存成功');
      return true;
    }
    message.error(result.errorMessage);
    return false;
  }

  /** 角色授权 */
  const handlerRoleAuthorize = async (data: { id: number, menuIds: number[] }) => {
    if (currentRecord) {
      const result = await roleAuthorize(data);
      if (result.success) {
        return true;
      }
    }
    return false;
  }

  /** 选中记录id集合获取 */
  const getIdArray = () => {
    const idArray = new Array<number>();
    selectedRowsState.forEach((roleListItem: API.RoleListItem) => {
      idArray.push(roleListItem.id);
    });
    return idArray;
  }

  /** 角色删除 */
  const handleDelete = async () => {
    if (currentRecord) {
      await deleteRole(currentRecord.id);
      message.success('角色删除完成');
      actionRef.current?.reload();
    }
  }

  /** 角色批量删除 */
  const handleDeleteBatch = async () => {
    const idArray = getIdArray();
    await deleteRoleBatch(idArray);
    message.success('角色删除完成');
    actionRef.current?.reload();
  }

  /** 批量操作菜单 */
  const menu = (
    <Menu>
      {access.roleDelete && <Menu.Item key="deleteBatch" icon={<DeleteOutlined/>}>
        <span
          key="deleteBatch"
          onClick={() => {
            Confirm({
              selectedRows: selectedRowsState,
              confirmContent: '确认要删除所选角色吗？',
              onOk: handleDeleteBatch
            });
          }}
        >
         删除
        </span>
      </Menu.Item>}
    </Menu>
  );

  /** 操作菜单 */
  const optionMenu = (
    <Menu>
      {access.roleAuthorize && <Menu.Item key="authorize">
        <span
          key="authorize"
          onClick={() => {
            handleAuthorizeDrawerVisible(true);
          }}
        >
         授权
        </span>
      </Menu.Item>}
      {access.roleEdit && <Menu.Item key="edit">
        <span
          key="edit"
          onClick={() => {
            handleUpdateModalVisible(true);
          }}
        >
          编辑
        </span>
      </Menu.Item>}
      {access.roleDelete && <Menu.Item key="delete">
        <span
          key="delete"
          onClick={() => {
            Confirm({
              needCheck: false,
              confirmContent: '确认要删除所选角色吗？',
              onOk: handleDelete
            });
          }}
        >
         删除
        </span>
      </Menu.Item>}
    </Menu>
  );

  const columns: ProColumns<API.RoleListItem>[] = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      render: (dom, record) => {
        return (
          <a
            onClick={() => {
              setCurrentRecord(record);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
      search: false,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      search: false,
    },
    {
      title: '创建者',
      dataIndex: 'createBy',
      search: false,
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
            setCurrentRecord(record);
            setShowDetail(true);
          }}
        >
          详情
        </a>,
        <Access
          key={"more"}
          accessible={access.roleAuthorize || access.roleEdit || access.roleDelete}
        >
          <Dropdown key="more" overlay={optionMenu} onVisibleChange={
            (visible: boolean) => {
              if (visible) {
                setCurrentRecord(record);
              }
            }
          }>
            <a
              hidden={record.roleCode === 'admin'}
              className="ant-dropdown-link"
              onClick={e => e.preventDefault()}>
              更多&nbsp;<DownOutlined/>
            </a>
          </Dropdown>
        </Access>
      ],
    },
  ];

  const detailsColumns: ProColumns<API.RoleListItem>[] = [
    {
      title: '角色名',
      dataIndex: 'roleName',
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '创建者',
      dataIndex: 'createBy',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    }
  ];

  return (
    <PageContainer>
      <ProTable<API.RoleListItem, API.PageParams>
        headerTitle="角色列表"
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        actionRef={actionRef}
        request={queryRoleList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows: API.RoleListItem[]) => {
            setSelectedRows(selectedRows);
          },
        }}
        toolBarRender={() => [
          <Access
            key={"roleDelete"}
            accessible={access.roleDelete}
          >
            <Dropdown overlay={menu} placement="bottomLeft">
              <Button>批量操作<DownOutlined/></Button>
            </Dropdown>
          </Access>,
          <Access
            key={"roleAdd"}
            accessible={access.roleAdd}
          >
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                handleCreateModalVisible(true);
              }}
            >
              <PlusOutlined/>新建
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
          const success = await handleAdd(value);
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
      <UpdateForm
        key="edit"
        modalVisible={updateModalVisible}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRecord(undefined);
        }}
        onSubmit={async (value: Record<string, any>) => {
          const success = await handleUpdate(value);
          setCurrentRecord(undefined);
          if (success) {
            handleUpdateModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        values={currentRecord ?? {}}
      />
      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRecord(undefined);
          setShowDetail(false);
        }}
        closable={true}
      >
        {setCurrentRecord?.name && (
          <ProDescriptions<API.RoleListItem>
            column={2}
            title={currentRecord?.roleName}
            request={async () => ({
              data: currentRecord || {},
            })}
            params={{
              id: currentRecord?.id,
            }}
            columns={detailsColumns as ProDescriptionsItemProps<API.RoleListItem>[]}
          />
        )}
      </Drawer>
      <RoleAuthorize
        id={currentRecord?.id}
        visible={authorizeDrawerVisible}
        onCancel={() => {
          handleAuthorizeDrawerVisible(false);
          setCurrentRecord(undefined);
        }}
        onSubmit={async (value: Record<string, any>) => {
          if (currentRecord) {
            const success = await handlerRoleAuthorize({id: currentRecord.id, menuIds: value.permission});
            if (success) {
              setCurrentRecord(undefined);
              handleAuthorizeDrawerVisible(false);
              message.success('角色授权完成');
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }
        }}
      />
    </PageContainer>
  );
}
export default RoleList;
