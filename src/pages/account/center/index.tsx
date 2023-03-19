import {Card, Col, Divider, Row} from 'antd';
import React from 'react';
import {GridContent} from '@ant-design/pro-layout';
import {useRequest, useModel} from 'umi';
import styles from './Center.less';
import {queryUser} from "@/services/api/user/user";
import HeadPhoto from "@/components/HeadPhoto";
import {HomeOutlined, MailOutlined, PhoneOutlined} from "@ant-design/icons";

const Center: React.FC = () => {
  const {data: userInfo, loading} = useRequest(() => {
    return queryUser();
  });
//  渲染用户信息
  const renderUserInfo = () => {
    return (
      <div className={styles.detail}>
        <p>
          <PhoneOutlined style={{
            marginRight: 8,
          }}/>
          {userInfo.phone ? userInfo.phone : '-'}
        </p>
        <p>
          <MailOutlined style={{
            marginRight: 8,
          }}/>
          {userInfo.email ? userInfo.email : '-'}
        </p>
        <p>
          <HomeOutlined
            style={{
              marginRight: 8,
            }}
          />
          {userInfo.province ? `${userInfo.province}${userInfo.city}` : '-'}
        </p>
      </div>
    );
  };
  return (
    <GridContent>
      <Row gutter={24}>
        <Col lg={7} md={24}>
          <Card bordered={false} style={{marginBottom: 24}} loading={loading}>
            {!loading && userInfo && (
              <div>
                <div className={styles.avatarHolder}>
                  <HeadPhoto style={{marginBottom: 20}} currentUser={true} size={104}/>
                  <div className={styles.name}>{userInfo.nickName}</div>
                  <div>{userInfo?.profile}</div>
                </div>
                {renderUserInfo()}
                <Divider dashed/>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </GridContent>
  );
};
export default Center;
