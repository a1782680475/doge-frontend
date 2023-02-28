import { Avatar, List, Popconfirm, Typography } from 'antd';

import React from 'react';
import classNames from 'classnames';
import styles from './NoticeList.less';
import { NoticeType } from './NoticeType';
import { Confirm } from '@/utils/confirm';
export type NoticeIconTabProps = {
  type: NoticeType;
  count?: number;
  showClear?: boolean;
  showViewMore?: boolean;
  style?: React.CSSProperties;
  title: string;
  tabKey: NoticeType;
  onClick?: (item: API.NoticeItem) => void;
  onClear?: () => void;
  emptyText?: string;
  clearText?: string;
  viewMoreText?: string;
  list: API.NoticeItem[];
  onViewMore?: (e: any) => void;
};
const NoticeList: React.FC<NoticeIconTabProps> = ({
  type,
  list = [],
  onClick,
  onClear,
  title,
  onViewMore,
  emptyText,
  showClear = true,
  clearText,
  viewMoreText,
  showViewMore = false,
}) => {
  if (!list || list.length === 0) {
    return (
      <div>
        <div className={styles.notFound}>
          <img
            src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            alt="not found"
          />
          <div>{emptyText}</div>
        </div>
        <div className={styles.bottomBar}>
          {showViewMore ? (
            <div
              onClick={() => {
                if (onViewMore) {
                  onViewMore(type);
                }
              }}
            >
              {viewMoreText}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
  return (
    <div>
      <List<API.NoticeItem>
        className={styles.list}
        dataSource={list}
        renderItem={(item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });
          // eslint-disable-next-line no-nested-ternary
          let leftIcon = null;
          let noticeItem;
          switch (type) {
            case NoticeType.Remind:
              noticeItem = item as API.RemindItem;
            case NoticeType.Message:
              noticeItem = item as API.MessageItem;
              leftIcon = noticeItem.extra ? (
                typeof noticeItem.extra === 'string' ? (
                  <Avatar className={styles.avatar} src={noticeItem.extra} />
                ) : (
                  noticeItem.extra
                )
              ) : null;
            default: null;
          }
          return (
            <List.Item
              className={itemCls}
              key={item.key || i}
              onClick={() => {
                onClick?.(item);
              }}
            >
              <List.Item.Meta
                className={styles.meta}
                avatar={leftIcon}
                title={
                  <div className={styles.title}>
                    {(() => {
                      switch (type) {
                        case NoticeType.Remind:
                          const remindItem = item as API.RemindItem;
                          return remindItem.title;
                        case NoticeType.Message:
                          const messageItem = item as API.MessageItem;
                          return messageItem.senderName;
                        case NoticeType.Bulletin:
                          const bulletinItem = item as API.BulletinItem;
                          return bulletinItem.title;
                        default: return null;
                      }
                    })()}
                  </div>
                }
                description={
                  <div>
                    {(() => {
                      switch (type) {
                        case NoticeType.Message:
                        case NoticeType.Bulletin:
                          const messageItem = item as API.MessageItem;
                          return <div className={styles.description}><Typography.Paragraph ellipsis={{ rows: 2, expandable: false }}>{messageItem.content}</Typography.Paragraph></div>;
                        default: return null;
                      }
                    })()}
                    <div className={styles.datetime}>{item.sendTime}</div>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
      <div className={styles.bottomBar}>
        {showClear ? (
          <Popconfirm
            title={`确定要将所有${title}标记为已读吗`}
            onConfirm={onClear}
            okText="是"
            cancelText="否"
          >
            <div>  {clearText} {title}</div>
          </Popconfirm>
        ) : null}
        {showViewMore ? (
          <div
            onClick={() => {
              if (onViewMore) {
                onViewMore(type);
              }
            }}
          >
            {viewMoreText}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NoticeList;
