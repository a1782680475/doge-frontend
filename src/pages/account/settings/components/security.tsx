import React from 'react';
import { List } from 'antd';

type Unpacked<T> = T extends (infer U)[] ? U : T;

const SecurityView: React.FC = () => {
  const getData = () => [
    {
      title: '账户密码',
      description: (
        <>
          已设置
        </>
      ),
      actions: [<a key="Modify">修改</a>],
    },
    {
      title: '密保手机',
      description: `已绑定手机：138****8293`,
      actions: [<a key="Modify">修改</a>],
    },
    {
      title: '备用邮箱',
      description: `已绑定邮箱：ant***sign.com`,
      actions: [<a key="Modify">修改</a>],
    },
  ];

  const data = getData();
  return (
    <>
      <List<Unpacked<typeof data>>
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
    </>
  );
};

export default SecurityView;
