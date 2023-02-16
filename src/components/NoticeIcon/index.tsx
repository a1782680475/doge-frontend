import { useEffect, useState } from 'react';
import { message } from 'antd';
import { useModel, useRequest } from 'umi';

import NoticeIcon from './NoticeIcon';
import styles from './index.less';
import { queryUnreadRemindList, queryUnreadRemindCount, remindRead, queryUnreadMessageList, queryUnreadMessageCount, messageRead, queryUnreadBulletinList, queryUnreadBulletinCount, bulletinRead, remindClearUnread, messageClearUnread, bulletinClearUnread } from "@/services/api/notify/notify";
import HeadPhoto from '../HeadPhoto';
import { history, useLocation } from 'umi';
import noticeUtils from "@/utils/noticeUtils";
import { NoticeType } from './NoticeType';
export type GlobalHeaderRightProps = {
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
};

const getMessageData = (messages: API.MessageItem[]): API.MessageItem[] => {
  if (!messages || messages.length === 0 || !Array.isArray(messages)) {
    return [];
  }
  const newMessages = messages.map((message) => {
    const newMessage = { ...message };
    if (newMessage.id) {
      newMessage.key = newMessage.id;
    }
    newMessage.extra = <HeadPhoto style={{ marginTop: 4 }} src={newMessage.senderAvatar} size={32} />;
    return newMessage;
  });
  return newMessages;
};

const getBulletinData = (bulletins: API.BulletinItem[]): API.BulletinItem[] => {
  if (!bulletins || bulletins.length === 0 || !Array.isArray(bulletins)) {
    return [];
  }
  const newBulletins = bulletins.map((bulletin) => {
    const newBulletin = { ...bulletin };
    if (newBulletin.id) {
      newBulletin.key = newBulletin.id;
    }
    return newBulletin;
  });
  return newBulletins;
};

const NoticeIconView = () => {
  const { initialState } = useModel('@@initialState');
  const location = useLocation();
  const { currentUser } = initialState || {};
  const [reminds, setReminds] = useState<API.RemindItem[]>([]);
  const [messages, setMessages] = useState<API.MessageItem[]>([]);
  const [bulletins, setBulletins] = useState<API.BulletinItem[]>([]);
  const { data: remindPageData } = useRequest(() => {
    return queryUnreadRemindList(({ count: 5 }));
  });
  const { data: messageData } = useRequest(() => {
    return queryUnreadMessageList(({ count: 5 }));
  });
  const { data: bulletinData } = useRequest(() => {
    return queryUnreadBulletinList(({ count: 5 }));
  });
  const { data: unreadRemindCount } = useRequest(queryUnreadRemindCount);
  const { data: unreadMessageCount } = useRequest(queryUnreadMessageCount);
  const { data: unreadBulletinCount } = useRequest(queryUnreadBulletinCount);
  useEffect(() => {
    setReminds(noticeUtils.getRemindData(remindPageData));
    setMessages(getMessageData(messageData));
    setBulletins(getBulletinData(bulletinData));
  }, [remindPageData, messageData, bulletinData]);

  const changeRemindReadState = (id: number | null) => {
    setReminds(
      reminds.map((item) => {
        const notice = { ...item };
        if (id == null || notice.id === id) {
          notice.read = true;
        }
        return notice;
      }),
    );
  };

  const changeMessageReadState = (id: number | null) => {
    setMessages(
      messages.map((item) => {
        const notice = { ...item };
        if (id == null || notice.id === id) {
          notice.read = true;
        }
        return notice;
      }),
    );
  };

  const changeBulletinReadState = (id: number | null) => {
    setBulletins(
      bulletins.map((item) => {
        const notice = { ...item };
        if (id == null || notice.id === id) {
          notice.read = true;
        }
        return notice;
      }),
    );
  };

  const clearReadState = (title: string, key: NoticeType) => {
    switch (key) {
      case NoticeType.Remind:
        remindClearUnread().then(() => {
          changeRemindReadState(null);
        });
        break;
      case NoticeType.Message:
        messageClearUnread().then(() => {
          changeMessageReadState(null);
        });
        break;
      case NoticeType.Bulletin:
        bulletinClearUnread().then(() => {
          changeBulletinReadState(null);
        });
        break;
      default:
        break;
    }
    message.success(`已将所有${title}标记为已读`);
  };

  const showMore = (type: NoticeType) => {
    const noticePathName = '/notice'
    if (location.pathname == noticePathName) {
      history.replace({
        pathname: noticePathName,
        query: {
          type: type.toString()
        }
      });
    } else {
      history.push({
        pathname: noticePathName,
        query: {
          type: type.toString()
        }
      });
    }
  }

  return (
    <NoticeIcon
      className={styles.action}
      count={currentUser && currentUser.unreadCount}
      onItemClick={(type, item) => {
        const { id } = item;
        switch (type) {
          case NoticeType.Remind:
            remindRead(id).then(() => {
              changeRemindReadState(id);
            });
            break;
          case NoticeType.Message:
            messageRead(id).then(() => {
              changeMessageReadState(id);
            });
            break;
          case NoticeType.Bulletin:
            bulletinRead(id).then(() => {
              changeBulletinReadState(id);
            });
            break;
          default:
            break;
        }
      }}
      onClear={(title: string, key: NoticeType) => clearReadState(title, key)}
      loading={false}
      clearText="清空"
      viewMoreText="查看更多"
      onViewMore={(type: NoticeType) => showMore(type)}
      clearClose
    >
      <NoticeIcon.Tab
        type={NoticeType.Remind}
        tabKey={NoticeType.Remind}
        count={unreadRemindCount}
        list={reminds}
        title="通知"
        emptyText="你已查看所有通知"
        showViewMore
      />
      <NoticeIcon.Tab
        type={NoticeType.Message}
        tabKey={NoticeType.Message}
        count={unreadMessageCount}
        list={messages}
        title="私信"
        emptyText="你已查看所有私信"
        showViewMore
      />
      <NoticeIcon.Tab
        type={NoticeType.Bulletin}
        tabKey={NoticeType.Bulletin}
        count={unreadBulletinCount}
        list={bulletins}
        title="公告"
        emptyText="你已查看所有公告"
        showViewMore
      />
    </NoticeIcon>
  );
};

export default NoticeIconView;
