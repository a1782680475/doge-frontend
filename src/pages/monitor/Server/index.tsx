import { Card, Col, Descriptions, Row, Space, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {queryServerInfo} from "@/services/api/monitor/monitor";
import { Gauge, Area } from '@ant-design/charts';
import _ from 'lodash';

const MonitorServer: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [serverInfo, setServerInfo] = useState<API.MonitorServerInfo>();
  const [cpuInfo, setCpuInfo] = useState<any[]>([]);
  const [memoryInfo, setMemoryInfo] = useState<any[]>([]);
  const [diskInfo, setDiskInfo] = useState<any[]>([]);
  const [cpuRate, setCpuRate] = useState<number>(0);
  const [memRate, setMemRate] = useState<number>(0);
  const [cpuRateAreaData, setCpuRateAreaData] = useState<{ second: string, rate: number }[]>([]);
  const gaugeGraphRef = useRef(null);
  const areaLength = 60;
  let cpuRateAreaDataTemp: { second: string; rate: number; }[] = [];
  const getData = () => {
    queryServerInfo().then((result) => {
      setServerInfo(result.data);
      const { cpu, mem, sysFiles } = result.data as API.MonitorServerInfo;
      const cpuRate = _.round((100.0 - cpu.free) / 100.0, 2);
      setCpuRate(cpuRate);
      setMemRate(_.round(mem.used / mem.total, 2));
      if (cpuRateAreaDataTemp.length === 0) {
        for (let i = 0; i <= areaLength; i++) {
          cpuRateAreaDataTemp.push({ second: `${60 - i}秒`, rate: _.round(cpuRate * 100, 2) });
        }
      }
      else {
        cpuRateAreaDataTemp = _.takeRight(cpuRateAreaDataTemp, cpuRateAreaDataTemp.length - 1);
        cpuRateAreaDataTemp = cpuRateAreaDataTemp.map((value, index) => {
          return { second: `${60 - index}秒`, rate: value.rate };
        });
        cpuRateAreaDataTemp.push({ second: '0秒', rate: _.round(cpuRate * 100, 2) });
      }
      setCpuRateAreaData(cpuRateAreaDataTemp);
      setCpuInfo([{
        key: 'cpuNum',
        title: '核心数',
        value: cpu.cpuNum
      }, {
        key: 'cpuSys',
        title: '系统使用率',
        value: `${cpu.sys}%`
      }, {
        key: 'cpuUsed',
        title: '用户使用率',
        value: `${cpu.used}%`
      }, {
        key: 'cpuFree',
        title: '当前空闲率',
        value: `${cpu.free}%`
      }]);
      setMemoryInfo([{
        key: 'memTotal',
        title: '总内存',
        value: `${mem.total}GB`
      }, {
        key: 'memUsed',
        title: '已用内存',
        value: `${mem.used}GB`
      }, {
        key: 'memFree',
        title: '剩余内存',
        value: `${mem.free}GB`
      }, {
        key: 'memUsage',
        title: '使用率',
        value: `${((mem.used / mem.total) * 100).toFixed(2)}%`
      }]);
      setDiskInfo(sysFiles.map((item) => {
        return {
          key: `disk${item.dirName}`,
          ...item
        }
      }));
      setLoading(false);
    });
  }
  useEffect(() => {
    getData();
    const timerCode = setInterval(() => { getData(); }, 1000);
    return () => {
      setServerInfo(undefined);
      setCpuInfo([]);
      setMemoryInfo([]);
      setDiskInfo([]);
      clearInterval(timerCode);
    }
  }, []);
  const CpuGauge = () => {
    const config = {
      percent: 0,
      range: {
        ticks: [0, 1],
        color: ['l(0) 0:#52c41a 0.5:#fa8c16 1:#f5222d'],
      },
      axis: {
        label: {
          formatter(v: number) {
            return Number(v) * 100;
          },
        },
        subTickLine: {
          count: 3,
        },
      },
      indicator: {
        pointer: {
          style: {
            stroke: '#D0D0D0',
          },
        },
        pin: {
          style: {
            stroke: '#D0D0D0',
          },
        },
      },
      statistic: {
        title: {
          formatter: ({ percent }) => {
            return `${_.round(percent * 100, 0)}%`;
          },
          style: ({ percent }) => {
            return {
              fontSize: '30px',
              lineHeight: 1,
              color: '#000',
            };
          },
        },
        content: {
          offsetY: 46,
          style: {
            fontSize: '18px',
            color: '#4B535E',
          },
          formatter: () => 'CPU使用',
        },
      },
      onReady: (plot) => {
        gaugeGraphRef.current = plot;
        if (gaugeGraphRef && gaugeGraphRef.current) {
          gaugeGraphRef.current.changeData(cpuRate);
        }
      },
    };
    return <Gauge {...config} />;
  };
  const MemGauge = () => {
    const config = {
      percent: 0,
      range: {
        ticks: [0, 1],
        color: ['l(0) 0:#52c41a 0.5:#fa8c16 1:#f5222d'],
      },
      axis: {
        label: {
          formatter(v: number) {
            return Number(v) * 100;
          },
        },
        subTickLine: {
          count: 3,
        },
      },
      indicator: {
        pointer: {
          style: {
            stroke: '#D0D0D0',
          },
        },
        pin: {
          style: {
            stroke: '#D0D0D0',
          },
        },
      },
      statistic: {
        title: {
          formatter: ({ percent }) => {
            return `${_.round(percent * 100, 0)}%`;
          },
          style: ({ percent }) => {
            return {
              fontSize: '30px',
              lineHeight: 1,
              color: '#000',
            };
          },
        },
        content: {
          offsetY: 46,
          style: {
            fontSize: '18px',
            color: '#4B535E',
          },
          formatter: () => '内存使用',
        },
      },
      onReady: (plot) => {
        gaugeGraphRef.current = plot;
        if (gaugeGraphRef && gaugeGraphRef.current) {
          gaugeGraphRef.current.changeData(memRate);
        }
      },
    };
    return <Gauge {...config} />;
  };
  const CpuArea = () => {
    const config = {
      data: cpuRateAreaData,
      xField: 'second',
      yField: 'rate',
      animation: false,
      xAxis: {
        grid: {
          line: {
            style: {
              stroke: '#ddd',
              lineDash: [4, 2],
            },
          },
          alternateColor: 'rgba(0,0,0,0.05)',
        }
      },
      yAxis: {
        max: 100, grid: {
          line: {
            style: {
              stroke: '#ddd',
              lineDash: [4, 2],
            },
          },
          alternateColor: 'rgba(0,0,0,0.05)',
        },
      },
      areaStyle: () => {
        return {
          fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
        };
      },
    };
    return <Area {...config} />;
  };
  return (
    <>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={8}>
          <Col span={4}>
            <Card loading={loading}  title="CPU使用">
              <CpuGauge />
            </Card>
          </Col>
          <Col span={4}>
            <Card loading={loading} title="内存使用">
              <MemGauge />
            </Card>
          </Col>
          <Col span={16}>
            <Card loading={loading} title="CPU活动">
              <CpuArea />
            </Card>
          </Col>
        </Row>
        <Card title="服务器信息" loading={loading}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="服务器名称" key={"computerName"}>{serverInfo?.sys.computerName}</Descriptions.Item>
            <Descriptions.Item label="IP地址" key={"computerIp"}>{serverInfo?.sys.computerIp}</Descriptions.Item>
            <Descriptions.Item label="操作系统" key={"osName"}>{serverInfo?.sys.osName}</Descriptions.Item>
            <Descriptions.Item label="系统架构" key={"osArch"}>{serverInfo?.sys.osArch}</Descriptions.Item>
          </Descriptions>
        </Card>
        <Row gutter={8}>
          <Col span={12}>
            <Card title="CPU信息" loading={loading}>
              <Table
                key={"cpu"}
                columns={[
                  {
                    title: '属性',
                    dataIndex: 'title',
                    width: '55%'
                  },
                  {
                    title: '值',
                    dataIndex: 'value',
                  },
                ]}
                dataSource={
                  cpuInfo
                }
                bordered
                pagination={false}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="内存信息" loading={loading}>
              <Table
                key={"mem"}
                columns={[
                  {
                    title: '属性',
                    dataIndex: 'title',
                    width: '55%'
                  },
                  {
                    title: '值',
                    dataIndex: 'value',
                  },
                ]}
                dataSource={
                  memoryInfo
                }
                bordered
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
        <Card title="磁盘信息" loading={loading}>
          <Table
            key={"cpu"}
            columns={[
              {
                title: '盘符路径',
                dataIndex: 'dirName',
              },
              {
                title: '文件系统',
                dataIndex: 'sysTypeName',
              },
              {
                title: '盘符类型',
                dataIndex: 'typeName',
              },
              {
                title: '总大小',
                dataIndex: 'total',
              },
              {
                title: '可用大小',
                dataIndex: 'free',
              },
            ]}
            dataSource={
              diskInfo
            }
            bordered
            pagination={false}
          />
        </Card>
        <Card title="Java虚拟机信息" loading={loading}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="JVM名称" key={"jvmName"}>{serverInfo?.jvm.name}</Descriptions.Item>
            <Descriptions.Item label="Java版本" key={"jvmVersion"}>{serverInfo?.jvm.version}</Descriptions.Item>
            <Descriptions.Item label="启动时间" key={"jvmStartTime"}>{serverInfo?.jvm.startTime}</Descriptions.Item>
            <Descriptions.Item label="运行时长" key={"jvmRunTime"}>{serverInfo?.jvm.runTime}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </>
  );
}
export default MonitorServer;