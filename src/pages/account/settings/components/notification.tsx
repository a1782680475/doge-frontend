import { querySubscriptionConfig, setSubscriptionConfig } from '@/services/api/notify/notify';
import { List, Switch } from 'antd';
import { result } from 'lodash';
import React, { Fragment, useEffect, useState } from 'react';
import { useRequest } from 'umi';

type Unpacked<T> = T extends (infer U)[] ? U : T;

const NotificationView: React.FC = () => {

  const [dataLoading, setDataLoading] = useState<boolean>(false);

  const [subscriptionConfigData, setSubscriptionConfigData] = useState<any>(null);

  const [currentKey, setCurrentKey] = useState<string | null>(null);

  const getRemindConfig = () => {
    setDataLoading(true);
    querySubscriptionConfig().then((result) => {
      setDataLoading(false);
      setSubscriptionConfigData(result.data);
    });
  }

  const onConfigChange = (key: string) => {
    setCurrentKey(key);
  }

  const onAccountPwdConfigChange = (checked: boolean) => {
    setSubscriptionConfig('account_password_change', checked).then(() => {
      getRemindConfig();
    });
  };

  const getData = () => {
    const Action = <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked checked={subscriptionConfigData?.account_password_change} onChange={onAccountPwdConfigChange} />;
    return [
      {
        title: '账户密码',
        description: '当账户安全相关信息变动时以通知形式告知',
        actions: [Action],
      },
    ];
  };

  const data = getData();

  useEffect(() => {
    getRemindConfig();
  }, [])

  return (
    <Fragment>
      <List<Unpacked<typeof data>>
        itemLayout="horizontal"
        dataSource={data}
        loading={dataLoading}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
    </Fragment>
  );
};

export default NotificationView;
