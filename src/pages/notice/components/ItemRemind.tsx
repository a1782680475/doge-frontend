import { queryRemindPageList, remindRead } from "@/services/api/notify/notify";
import { Avatar, Card, List } from "antd";
import React, { useEffect, useState } from "react";
import noticeUtils from "@/utils/noticeUtils";
import styles from './item.less';
const ItemRemind: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState<API.PageResponse<API.RemindItem>>();
  const pageSize = 10
  const queryData = async (current: number, pageSize: number) => {
    const result = await queryRemindPageList({ current, pageSize });
    return result;
  }
  useEffect(() => {
    queryData(0, pageSize).then((data) => {
      setPageData(data.data);
      setLoading(false)
    });
  }, []);
  return (
    <>
      {
        <Card>
          <List
            itemLayout="vertical"
            loading={loading}
            pagination={{
              position: "bottom",
              total: pageData?.total || 0,
              pageSize,
              className: styles.pagination,
              onChange: (page, pageSize) => {
                queryData(page, pageSize).then((data) => {
                  setPageData(data.data);
                });
              }
            }}
            dataSource={noticeUtils.getRemindData(pageData?.data || [])}
            renderItem={(item: API.RemindItem) => (
              <List.Item
                actions={item.read ? [] : [
                  <a key="list-read" onClick={(e) => {
                    remindRead(item.id).then(() => {
                      const newPageData = { ...pageData }
                      newPageData!!.data = newPageData?.data?.map((value) => {
                        if (item.id == value.id) {
                          value.read = true
                        }
                        return value
                      })
                      setPageData(newPageData)
                    });
                  }}>设为已读</a>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.extra} />}
                  title={item.title}
                  description={item.sendTime}
                />
                <div style={{ marginTop: 5 }} >{item.content}</div>
              </List.Item>
            )}
          />
        </Card>
      }
    </>
  );
}
export default ItemRemind;
