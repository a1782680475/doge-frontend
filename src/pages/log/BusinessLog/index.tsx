import {Confirm} from "@/utils/confirm";
import {Access, useAccess} from "umi";
import {useRef, useState} from "react";
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import ReactJson from 'react-json-view';
import {
  clearBusinessLog,
  deleteBusinessLog,
  deleteBusinessLogBatch,
  queryBusinessLog
} from "@/services/api/log/businessLog";
import {ClearOutlined, DeleteOutlined, DownOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import {Button, Drawer, Dropdown, Menu, message, Popconfirm, Tooltip, Typography} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import ProDescriptions, {ProDescriptionsItemProps} from "@ant-design/pro-descriptions";
import {JSONIcon} from "@/components/Icon/JSON";

const BusinessLog: React.FC = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.BusinessLogItem[]>([]);
  const [currentRecord, setCurrentRecord] = useState<API.BusinessLogItem>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [previewJSON, setPreviewJSON] = useState(false);
  const [JSONData, setJSONData] = useState<string>('{}');
  const {Text} = Typography;

  /** 日志列表查询 */
  const queryLogList = async (params: API.PageParams, sorter: any, filter: any) => {
    const result = await queryBusinessLog({...params, sorter, ...filter});
    return result.data;
  }

  /** 选中记录id集合获取 */
  const getIdArray = () => {
    const idArray = new Array<number>();
    selectedRowsState.forEach((userListItem: API.BusinessLogItem) => {
      idArray.push(userListItem.id);
    });
    return idArray;
  }

  /** 日志删除 */
  const handleDelete = async (id: number) => {
    await deleteBusinessLog(id);
  }

  /** 日志批量删除 */
  const handleDeleteBatch = async () => {
    const idArray = getIdArray();
    await deleteBusinessLogBatch(idArray);
    message.success('日志删除完成');
    actionRef.current?.reload();
  }

  /** 日志清空 */
  const handleClear = async () => {
    await clearBusinessLog();
  }

  const showPopconfirm = () => {
    setVisible(true);
  };

  const handleClearOk = () => {
    setConfirmLoading(true);
    handleClear().then(() => {
      setVisible(false);
      setConfirmLoading(false);
      message.success('日志已清空');
      actionRef.current?.reload();
    });
  };

  const isJSON = (str: any) => {
    if (typeof str === 'string') {
      try {
        const obj = JSON.parse(str);
        if (typeof obj === 'object' && obj) {
          return true;
        }
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  /** 批量操作菜单 */
  const menu = (
    <Menu>
      {access.userEnable && <Menu.Item key="deleteBatch" icon={<DeleteOutlined/>}>
        <span
          key="deleteBatch"
          onClick={() => {
            Confirm({
              selectedRows: selectedRowsState,
              confirmContent: '确认要删除所选日志吗？',
              onOk: handleDeleteBatch
            });
          }}
        >
          删除
        </span>
      </Menu.Item>}
    </Menu>
  );

  const columns: ProColumns<API.BusinessLogItem>[] = [
    {
      title: '业务名称',
      dataIndex: 'title',
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
      title: '操作人',
      dataIndex: 'operationUser',
    },
    {
      title: '结果',
      dataIndex: 'status',
      filters: true,
      search: false,
      valueEnum: {
        true: {
          text: (
            '成功'
          ),
          status: 'Success',
        },
        false: {
          text: (
            '失败'
          ),
          status: 'Error',
        },
      }
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      sorter: true,
      search: false,
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      hideInTable: true,
      valueType: 'dateRange',
      search: {
        transform: (value) => {
          return {
            startTime: `${value[0]}-00:00:00`,
            endTime: `${value[1]}-23:59:59`,
          };
        },
      },
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
          key={"delete"}
          accessible={access.businessLogDelete}
        >
          <a
            key="delete"
            onClick={() => {
              setCurrentRecord(record);
              Confirm({
                needCheck: false,
                confirmContent: '确认要删除此日志吗？',
                onOk: () => {
                  handleDelete(record.id).then(() => {
                    message.success('日志已删除');
                    actionRef.current?.reload();
                  });
                }
              });
            }}
          >
            删除
          </a>
        </Access>
      ],
    },
  ];

  const detailsColumns: ProColumns<API.BusinessLogItem>[] = [
    {
      title: '业务名称',
      dataIndex: 'title',
    },
    {
      title: '请求URL',
      dataIndex: 'requestUrl',
    },
    {
      title: '请求方法',
      dataIndex: 'requestMethod',
    },
    {
      title: '请求参数',
      dataIndex: 'requestParams',
      render: (dom, record) => {
        return (<div>
          <Tooltip title={record.requestParams}>
            <Text style={{maxWidth: 120}} ellipsis={true}>
              {record.requestParams}
            </Text>
          </Tooltip>
          {isJSON(record.requestParams) &&
          <Tooltip title="预览"><JSONIcon style={{fill: '#1890FF', marginLeft: 4, cursor: 'pointer'}}
                                        onClick={() => {
                                          setJSONData(record.requestParams);
                                          setPreviewJSON(true);
                                        }}/></Tooltip>}
        </div>);
      }
    },
    {
      title: '结果',
      dataIndex: 'status',
      filters: true,
      search: false,
      valueEnum: {
        true: {
          text: (
            '成功'
          ),
          status: 'Success',
        },
        false: {
          text: (
            '失败'
          ),
          status: 'Error',
        },
      }
    },
    {
      title: '请求时间',
      dataIndex: 'requestTime',
    },
    {
      title: '返回结果',
      dataIndex: 'response',
    },
    {
      title: '响应时间',
      dataIndex: 'responseTime',
    },
    {
      title: '请求目标类',
      dataIndex: 'targetClassName',
      render: (dom, record) => {
        return (<div>
          <Tooltip title={record.targetClassName}>
            <Text style={{maxWidth: 150}} ellipsis={true}>
              {record.targetClassName}
            </Text>
          </Tooltip>
        </div>);
      }
    },
    {
      title: '请求目标方法',
      dataIndex: 'targetMethodName',
    },
    {
      title: '异常信息',
      dataIndex: 'exception',
    },
    {
      title: '操作人',
      dataIndex: 'operationUser',
    },
    {
      title: '操作IP',
      dataIndex: 'operationIp',
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.BusinessLogItem, API.PageParams>
        headerTitle="日志列表"
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        actionRef={actionRef}
        request={queryLogList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows: API.BusinessLogItem[]) => {
            setSelectedRows(selectedRows);
          },
        }}
        toolBarRender={() => [
          <Popconfirm
            title="该操作不可恢复，确定吗？"
            icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
            visible={visible}
            onConfirm={handleClearOk}
            okButtonProps={{loading: confirmLoading}}
            onCancel={() => {
              setVisible(false);
            }}
          >
            <Button danger onClick={showPopconfirm}>清空<ClearOutlined/></Button>
          </Popconfirm>
          , <Access
            key={"batch"}
            accessible={access.businessLogDelete}
          >
            <Dropdown overlay={menu} placement="bottomLeft">
              <Button>批量操作<DownOutlined/></Button>
            </Dropdown>
          </Access>
        ]}
      />
      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRecord(undefined);
          setShowDetail(false);
        }}
        closable={true}
        maskClosable={true}
      >
        {setCurrentRecord?.name && (
          <>
            <ProDescriptions<API.BusinessLogItem>
              column={2}
              title={currentRecord?.title}
              request={async () => ({
                data: currentRecord || {},
              })}
              params={{
                id: currentRecord?.id,
              }}
              columns={detailsColumns as ProDescriptionsItemProps<API.BusinessLogItem>[]}
            />
            <Drawer
              title="预览"
              width={500}
              closable={true}
              visible={previewJSON}
              maskClosable={true}
              onClose={() => {
                setPreviewJSON(false);
              }}
            >
              <ReactJson
                src={JSON.parse(JSONData)}
                name={null}
                iconStyle="square"
                enableClipboard={false}
                displayDataTypes={false}
                displayObjectSize={false}
              />
            </Drawer>
          </>
        )}
      </Drawer>
    </PageContainer>
  );
}
export default BusinessLog;
