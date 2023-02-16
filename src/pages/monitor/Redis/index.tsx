import React, {useState} from "react";
import {useRequest} from 'umi';
import {queryRedisInfo} from "@/services/api/monitor/monitor";
import {Card, Descriptions, Space, Table} from "antd";
import moment from "moment";

const MonitorRedis: React.FC = () => {
  const [DBInfo, setDBInfo] = useState<any[]>([]);
  const {data, loading} = useRequest(() => {
    return queryRedisInfo();
  }, {
    onSuccess: (result) => {
      const arrTemp: { db: string, keys: Number, expires: number, avg_ttl: number }[] = [];
      Object.keys(result).forEach((key: string) => {
        if (key.substr(0, 2) === 'db') {
          arrTemp.push(JSON.parse(`{"db=${key},${result[key]}"}`.replaceAll('=', '":"').replaceAll(',', '","')));
        }
      });
      setDBInfo(arrTemp);
    }
  });
  return (<>
    <Space direction="vertical" style={{width: '100%'}}>
      <Card title="Redis信息" loading={loading}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Redis版本" key={"redis_version"}>{data?.redis_version}</Descriptions.Item>
          <Descriptions.Item label="宿主操作系统" key={"os"}>{data?.os}</Descriptions.Item>
          <Descriptions.Item label="架构（bit）" key={"arch_bits"}>{data?.arch_bits}</Descriptions.Item>
          <Descriptions.Item label="TCP/IP 监听端口" key={"tcp_port"}>{data?.tcp_port}</Descriptions.Item>
          <Descriptions.Item label="运行模式"
                             key={"redis_mode"}>{data?.redis_mode === 'standalone' ? '单机' : '集群'}</Descriptions.Item>
          <Descriptions.Item label="运行时间（天）" key={"uptime_in_days"}>{data?.uptime_in_days}</Descriptions.Item>
          <Descriptions.Item label="上次RDB备份"
                             key={"rdb_last_save_time"}>{data ? moment.unix(Number(data.rdb_last_save_time)).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
          <Descriptions.Item label="AOF持久化"
                             key={"aof_enabled"}>{data?.aof_enabled === '0' ? '否' : '是'}</Descriptions.Item>
          <Descriptions.Item label="系统总内存"
                             key={"total_system_memory_human"}>{data?.total_system_memory_human}</Descriptions.Item>
          <Descriptions.Item label="使用内存" key={"used_memory_human"}>{data?.used_memory_human}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="统计" loading={loading}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="已执行命令数量"
                             key={"total_commands_processed"}>{data?.total_commands_processed}</Descriptions.Item>
          <Descriptions.Item label="每秒执行命令数量"
                             key={"instantaneous_ops_per_sec"}>{data?.instantaneous_ops_per_sec}</Descriptions.Item>
          <Descriptions.Item label="过期被删除key数量" key={"expired_keys"}>{data?.expired_keys}</Descriptions.Item>
          <Descriptions.Item label="被驱逐的key数量" key={"evicted_keys"}>{data?.evicted_keys}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="DB信息" loading={loading}>
        <Table
          key={"DBTable"}
          rowKey={"db"}
          columns={[
            {
              key: 'db',
              title: 'DB',
              dataIndex: 'db',
            },
            {
              key: 'keys',
              title: 'key数',
              dataIndex: 'keys',
            },
            {
              key: 'expires',
              title: '过期key数',
              dataIndex: 'expires',
            },
            {
              key: 'avg_ttl',
              title: '平均存活时间（毫秒）',
              dataIndex: 'avg_ttl',
            },
          ]}
          dataSource={
            DBInfo
          }
          bordered
          pagination={false}
        />
      </Card>
    </Space>
  </>)
};

export default MonitorRedis;
