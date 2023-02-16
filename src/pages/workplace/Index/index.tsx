import React from 'react';
import {PageContainer} from "@ant-design/pro-layout";
import {Space} from "antd";
import styles from './index.less';
import {useModel} from 'umi';
import moment from 'moment';
import HeadPhoto from "@/components/HeadPhoto";

const Index: React.FC = () => {
  const {initialState} = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  return (
    <PageContainer content={
      <div className={styles.card}>
        <Space size="large">
          <HeadPhoto currentUser={true}/>
          <div className={styles.greet}>{moment().format('a')}好，{currentUser?.nickName}</div>
        </Space>
      </div>}>
    </PageContainer>
  );
}
export default Index;
