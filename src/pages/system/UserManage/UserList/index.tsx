import React, { useState, useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Drawer, Dropdown, Menu, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useAccess, Access } from 'umi';
import {
  queryPageList,
  enableUser,
  disableUser,
  settingRole,
  enableUserBatch,
  disableUserBatch,
  resetPassword,
} from '@/services/api/system/user';
import { EnableIcon, DisableIcon } from '@/components/Icon/icons';
import { Confirm } from '@/utils/confirm';
import { DownOutlined } from '@ant-design/icons';
import ProDescriptions, { ProDescriptionsItemProps } from "@ant-design/pro-descriptions";
import RoleSetting from "@/pages/system/UserManage/UserList/components/RoleSetting";
import ResetPassword from './components/ResetPassword';

const UserList: React.FC = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserListItem[]>([]);
  const [currentRecord, setCurrentRecord] = useState<API.UserListItem>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showRoleSetting, setShowRoleSetting] = useState<boolean>(false);
  const [showResetPassword, setShowResetPassword] = useState<boolean>(false);

  /** 用户列表查询 */
  const queryUserList = async (params: API.PageParams, sorter: any, filter: any) => {
    const result = await queryPageList({ ...params, sorter, ...filter });
    return result.data;
  }

  /** 选中记录id集合获取 */
  const getIdArray = () => {
    const idArray = new Array<number>();
    selectedRowsState.forEach((userListItem: API.UserListItem) => {
      idArray.push(userListItem.id);
    });
    return idArray;
  }

  /** 用户启用 */
  const handleEnable = async () => {
    if (currentRecord) {
      await enableUser(currentRecord.id);
      message.success('用户启用完成');
      actionRef.current?.reload();
    }
  }

  /** 用户禁用 */
  const handleDisable = async () => {
    if (currentRecord) {
      await disableUser(currentRecord.id);
      message.success('用户禁用完成');
      actionRef.current?.reload();
    }
  }

  /** 用户角色设置 */
  const handlerRoleSetting = async (data: { id: number, roleIds: number[] }) => {
    if (currentRecord) {
      const result = await settingRole(data);
      if (result.success) {
        return true;
      }
    }
    return false;
  }

  /** 用户密码重置 */
  const handlerResetPassword = async (data: { id: number, password: string }) => {
    if (currentRecord) {
      const result = await resetPassword(data);
      if (result.success) {
        return true;
      }
    }
    return false;
  }

  /** 用户批量启用 */
  const handleEnableBatch = async () => {
    const idArray = getIdArray();
    await enableUserBatch(idArray);
    message.success('用户启用完成');
    actionRef.current?.reload();
  }

  /** 用户批量禁用 */
  const handleDisableBatch = async () => {
    const idArray = getIdArray();
    await disableUserBatch(idArray);
    message.success('用户禁用完成');
    actionRef.current?.reload();
  }

  /** 批量操作菜单 */
  const menu = (
    <Menu>
      {access.userEnable && <Menu.Item key="enableBatch" icon={<EnableIcon />}>
        <span
          key="enableBatch"
          onClick={() => {
            Confirm({
              selectedRows: selectedRowsState,
              confirmContent: '确认要启用所选账户吗？',
              onOk: handleEnableBatch
            });
          }}
        >
          启用
        </span>,
      </Menu.Item>}
      {access.userDisable && <Menu.Item key="disableBatch" icon={<DisableIcon />}>
        <span
          key="disableBatch"
          onClick={() => {
            Confirm({
              selectedRows: selectedRowsState,
              confirmContent: '确认要禁用所选账户吗？',
              onOk: handleDisableBatch
            });
          }}
        >
          禁用
        </span>
      </Menu.Item>}
    </Menu>
  );

  /** 操作菜单 */
  const optionMenu = (
    <Menu>
      {access.userEnable && <Menu.Item key="enable">
        <span
          key="enable"
          onClick={() => {
            Confirm({
              needCheck: false,
              confirmContent: '确认要启用所选账户吗？',
              onOk: handleEnable
            });
          }}
        >
          启用
        </span>
      </Menu.Item>}
      {access.userDisable && <Menu.Item key="disable">
        <span
          key="disable"
          onClick={() => {
            Confirm({
              needCheck: false,
              confirmContent: '确认要禁用所选账户吗？',
              onOk: handleDisable
            });
          }}
        >
          禁用
        </span>
      </Menu.Item>}
      {access.roleSetting && <Menu.Item key="roleSetting">
        <span
          key="roleSetting"
          onClick={() => {
            setShowRoleSetting(true);
          }}
        >
          角色分配
        </span>
      </Menu.Item>}
      {access.resetPassword && <Menu.Item key="resetPassword">
        <span
          key="resetPassword"
          onClick={() => {
            setShowResetPassword(true);
          }}
        >
          密码重置
        </span>
      </Menu.Item>}
    </Menu>
  );

  const columns: ProColumns<API.UserListItem>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
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
      title: '启用状态',
      dataIndex: 'enabled',
      valueEnum: {
        true: {
          text: (
            '启用'
          ),
          status: 'Success',
        },
        false: {
          text: (
            '未启用'
          ),
          status: 'Default',
        },
      }
    },
    {
      title: '注册时间',
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
              hidden={record.username === 'super'}
              onClick={e => e.preventDefault()}>
              更多&nbsp;<DownOutlined />
            </a>
          </Dropdown>
        </Access>
      ],
    },
  ];

  const detailsColumns: ProColumns<API.UserListItem>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      valueEnum: {
        true: {
          text: (
            '启用'
          ),
          status: 'Success',
        },
        false: {
          text: (
            '未启用'
          ),
          status: 'Default',
        },
      }
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.UserListItem, API.PageParams>
        headerTitle="用户列表"
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        actionRef={actionRef}
        request={queryUserList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows: API.UserListItem[]) => {
            setSelectedRows(selectedRows);
          },
        }}
        toolBarRender={() => [
          <Access
            key={"batch"}
            accessible={access.userEnable || access.userDisable}
          >
            <Dropdown overlay={menu} placement="bottomLeft">
              <Button>批量操作<DownOutlined /></Button>
            </Dropdown>
          </Access>
        ]}
      />
      <RoleSetting
        id={currentRecord?.id}
        modalVisible={showRoleSetting}
        onSubmit={async (value: Record<string, any>) => {
          if (currentRecord) {
            const success = await handlerRoleSetting({ id: currentRecord.id, roleIds: value.role });
            if (success) {
              setCurrentRecord(undefined);
              setShowRoleSetting(false);
              message.success('角色设置完成');
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }
        }}
        onCancel={() => {
          setShowRoleSetting(false);
          setCurrentRecord(undefined);
        }}
      />
      <ResetPassword onSubmit={async (value: Record<string, any>) => {
        if (currentRecord) {
          const success = await handlerResetPassword({ id: currentRecord.id, password: value.password });
          if (success) {
            setCurrentRecord(undefined);
            setShowResetPassword(false);
            message.success('密码重置完成');
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }
      }} onCancel={() => {
        setShowResetPassword(false);
      }}
        modalVisible={showResetPassword}
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
          <ProDescriptions<API.UserListItem>
            column={2}
            title={currentRecord?.username}
            request={async () => ({
              data: currentRecord || {},
            })}
            params={{
              id: currentRecord?.id,
            }}
            columns={detailsColumns as ProDescriptionsItemProps<API.UserListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
}
export default UserList;
