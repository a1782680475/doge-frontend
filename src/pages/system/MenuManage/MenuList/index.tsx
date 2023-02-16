import React, {useState, useRef} from 'react';
import ProTable, {ProColumns, ActionType} from '@ant-design/pro-table';
import {Button, Drawer, Dropdown, Menu, message, Tag} from 'antd';
import {PageContainer} from '@ant-design/pro-layout';
import {useAccess, Access} from 'umi';
import {queryList, addMenu, updateMenu, deleteMenu, deleteMenuBatch} from '@/services/api/system/menu';
import {Confirm} from '@/utils/confirm';
import {DeleteOutlined, DownOutlined, PlusOutlined} from '@ant-design/icons';
import ProDescriptions, {ProDescriptionsItemProps} from "@ant-design/pro-descriptions";
import CreateForm from "@/pages/system/MenuManage/components/CreateForm";
import UpdateForm from "@/pages/system/MenuManage/components/UpdateForm";

const MenuList: React.FC = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [currentRecord, setCurrentRecord] = useState<API.MenuListItem>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<API.MenuListItem[]>([]);
  /** 编辑窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  /** 菜单列表查询 */
  const queryMenuList = async (params: API.PageParams, sorter: any, filter: any) => {
    const result = await queryList({...params, ...sorter, ...filter});
    return result.data;
  }

  /** 菜单新增 */
  const handleAdd = async (value: Record<string, any>) => {
    const result = await addMenu(value);
    if (result.success) {
      message.success('添加成功');
      return true;
    }
    message.error(result.errorMessage);
    return false;
  }

  /** 菜单编辑 */
  const handleUpdate = async (value: Record<string, any>) => {
    const result = await updateMenu(value);
    if (result.success) {
      message.success('保存成功');
      return true;
    }
    message.error(result.errorMessage);
    return false;
  }

  /** 菜单删除 */
  const handleDelete = async () => {
    if (currentRecord) {
      await deleteMenu(currentRecord.id);
      message.success('菜单删除完成');
      actionRef.current?.reload();
    }
  }

  /** 选中记录id集合获取 */
  const getIdArray = () => {
    const idArray = new Array<number>();
    selectedRowsState.forEach((menuListItem: API.MenuListItem) => {
      idArray.push(menuListItem.id);
    });
    return idArray;
  }

  /** 菜单批量删除 */
  const handleDeleteBatch = async () => {
    const idArray = getIdArray();
    await deleteMenuBatch(idArray);
    message.success('角色删除完成');
    actionRef.current?.reload();
  }

  /** 批量操作菜单 */
  const menu = (
    <Menu>
      {access.menuDelete && <Menu.Item key="deleteBatch" icon={<DeleteOutlined/>}>
        <span
          key="deleteBatch"
          onClick={() => {
            Confirm({
              selectedRows: selectedRowsState,
              confirmContent: '确认要删除所选菜单吗？',
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
      {access.menuAdd && <Menu.Item key="add" disabled={currentRecord?.type === 3}>
        <span
          key="add"
          onClick={currentRecord?.type === 3 ? undefined : () => {
            handleCreateModalVisible(true);
          }}
        >
          新增
        </span>
      </Menu.Item>}
      {access.menuEdit && <Menu.Item key="edit">
        <span
          key="edit"
          onClick={() => {
            handleUpdateModalVisible(true);
          }}
        >
          编辑
        </span>
      </Menu.Item>}
      {access.menuDelete && <Menu.Item key="delete">
        <span
          key="delete"
          onClick={() => {
            Confirm({
              needCheck: false,
              confirmContent: '确认要删除所选菜单吗？',
              onOk: handleDelete
            });
          }}
        >
         删除
        </span>,
      </Menu.Item>}
    </Menu>
  );

  const columns: ProColumns<API.MenuListItem>[] = [
    {
      title: '菜单名',
      dataIndex: 'menuName',
      search: false,
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
      title: '菜单类型',
      dataIndex: 'type',
      search: false,
      render: (type) => {
        let typeName;
        let color;
        switch (type) {
          case 1:
            typeName = '目录';
            color = '#1890ff';
            break;
          case 2:
            typeName = '菜单';
            color = '#ff7a45';
            break;
          case 3:
            typeName = '按钮';
            color = '#ffc53d';
            break;
          default:
            typeName = '其它';
            color = '#f759ab';
            break;
        }
        return (
          <Tag color={color}>{typeName}</Tag>
        );
      }
    },
    {
      title: '路径',
      dataIndex: 'path',
      search: false,
    },
    {
      title: '是否显示',
      dataIndex: 'visible',
      search: false,
      valueEnum: {
        true: {
          text: (
            '显示'
          ),
          status: 'Success',
        },
        false: {
          text: (
            '不显示'
          ),
          status: 'Default',
        },
      }
    },
    {
      title: '排序',
      dataIndex: 'sort',
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
      render:
        (_, record) => [
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
            accessible={access.menuAdd || access.menuEdit || access.menuDelete}
          >
            <Dropdown key="more" overlay={optionMenu} onVisibleChange={
              (visible: boolean) => {
                if (visible) {
                  setCurrentRecord(record);
                } else {
                  setCurrentRecord(undefined);
                }
              }
            }>
              <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                更多&nbsp;<DownOutlined/>
              </a>
            </Dropdown>
          </Access>
        ],
    }
  ];

  const detailsColumns: ProColumns<API.MenuListItem>[] = [
    {
      title: '菜单名称',
      dataIndex: 'menuName'
    },
    {
      title: '菜单类型',
      dataIndex: 'type',
      render: (type) => {
        let typeName;
        let color;
        switch (type) {
          case 1:
            typeName = '目录';
            color = '#1890ff';
            break;
          case 2:
            typeName = '菜单';
            color = '#ff7a45';
            break;
          case 3:
            typeName = '按钮';
            color = '#ffc53d';
            break;
          default:
            typeName = '其它';
            color = '#f759ab';
            break;
        }
        return (
          <Tag color={color}>{typeName}</Tag>
        );
      }
    },
    {
      title: '是否显示',
      dataIndex: 'visible',
      render: (value) => {
        return value ? '是' : '否';
      }
    },
    {
      title: '是否外链',
      dataIndex: 'frame',
      render: (value) => {
        return value ? '是' : '否';
      }
    },
    {
      title: '请求地址',
      dataIndex: 'path',
    },
    {
      title: '重定向',
      dataIndex: 'redirect',
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
    },
    {
      title: '缓存',
      dataIndex: 'cache',
      render: (value) => {
        return value ? '是' : '否';
      }
    },
    {
      title: '图标',
      dataIndex: 'icon',
    },
    {
      title: '排序',
      dataIndex: 'sort',
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
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.MenuListItem, API.PageParams>
        headerTitle="菜单列表"
        rowKey="id"
        search={false}
        actionRef={actionRef}
        request={queryMenuList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows: API.MenuListItem[]) => {
            setSelectedRows(selectedRows);
          },
        }}
        toolBarRender={() => [
          <Access
            key={"menuDelete"}
            accessible={access.menuDelete}
          >
            <Dropdown overlay={menu} placement="bottomLeft">
              <Button>批量操作<DownOutlined/></Button>
            </Dropdown>
          </Access>,
          <Access
            key={"menuAdd"}
            accessible={access.menuAdd}
          >
            <Button
              type="primary"
              key="create"
              onClick={() => {
                setCurrentRecord(undefined);
                handleCreateModalVisible(true);
              }}
            >
              <PlusOutlined/>新建
            </Button>
          </Access>,
        ]}
        pagination={false}
      />
      <CreateForm
        key="create"
        parentValues={currentRecord}
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
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />
      <UpdateForm
        key="update"
        modalVisible={updateModalVisible}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRecord(undefined);
        }}
        onSubmit={async (value: Record<string, any>) => {
          const success = await handleUpdate(value);
          if (success) {
            setCurrentRecord(undefined);
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
          <ProDescriptions<API.MenuListItem>
            column={2}
            title={currentRecord?.menuName}
            request={async () => ({
              data: currentRecord || {},
            })}
            params={{
              id: currentRecord?.id,
            }}
            columns={detailsColumns as ProDescriptionsItemProps<API.MenuListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
}
export default MenuList;
