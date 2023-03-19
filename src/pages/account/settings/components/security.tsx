import React, { useState } from 'react';
import { List, Modal } from 'antd';
import PasswordChangeDialog from './PasswordChangeDialog/index';
import { useRequest } from 'umi';
import { querySecurityInfo } from '@/services/api/user/user';
import BindEmailDialog from './BindEmailDialog';
import BindEmailChangeDialog from './BindEmailChangeDialog';

type Unpacked<T> = T extends (infer U)[] ? U : T;

const SecurityView: React.FC = () => {
  const [passwordChangeDialogOpen, handlePasswordChangeDialogOpen] = useState<boolean>(false);
  const [bindEmailDialogOpen, handleBindEmailDialogOpen] = useState<boolean>(false);
  const [emailChangeDialogOpen, handleEmailChangeDialogOpen] = useState<boolean>(false);
  const { data: securityInfoData, loading } = useRequest(() => {
    return querySecurityInfo();
  });
  const getData = () => [
    {
      title: '账户密码',
      description: (
        <>
          已设置
        </>
      ),
      actions: [<a key="Change" onClick={passwordChange}>修改</a>],
    },
    {
      title: '备用邮箱',
      description: securityInfoData?.accountEmail ? `已绑定邮箱：${securityInfoData.accountEmail}` : '未绑定',
      actions: securityInfoData?.accountEmail ? [<a key="Change" onClick={bindEmailChange}>修改</a>] : [<a key="Change" onClick={bindEmail}>绑定</a>],
    },
  ];

  const passwordChange = () => {
    if (securityInfoData?.accountEmail) {
      handlePasswordChangeDialogOpen(true)
    } else {
      Modal.confirm({
        title: '若要修改密码，请先绑定邮箱',
        content: '接下来将带您绑定邮箱，绑定成功后即可修改密码',
        okText: '去绑定',
        cancelText: '取消',
        onOk: () => {
          handleBindEmailDialogOpen(true)
        }
      });
    }
  }

  const bindEmail = () => {
    handleBindEmailDialogOpen(true)
  }

  const bindEmailChange = () => {
    handleEmailChangeDialogOpen(true)
  }

  const data = getData();
  return (
    <>
      <List<Unpacked<typeof data>>
        itemLayout="horizontal"
        dataSource={data}
        loading={loading}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
      <PasswordChangeDialog email={securityInfoData?.accountEmail} open={passwordChangeDialogOpen} onCancel={() => {
        handlePasswordChangeDialogOpen(false)
      }} />
      <BindEmailDialog open={bindEmailDialogOpen} onCancel={() => {
        handleBindEmailDialogOpen(false)
      }} />
      <BindEmailChangeDialog email={securityInfoData?.accountEmail} open={emailChangeDialogOpen} onCancel={() => {
        handleEmailChangeDialogOpen(false);
      }} />
    </>
  );
};

export default SecurityView;
