import {request} from 'umi';

/** 提醒获取 GET /notify/remind/remindPageList */
export async function queryRemindPageList(params: { current: number, pageSize: number }) {
  return request('/notify/remind/remindPageList', {
    method: 'GET',
    params
  });
}

/** 指定数目未读提醒获取 GET /notify/remind/unreadList */
export async function queryUnreadRemindList(params: { count: number}) {
  return request('/notify/remind/unreadList', {
    method: 'GET',
    params
  });
}

/** 未读提醒数获取 GET /notify/remind/unreadCount */
export async function queryUnreadRemindCount() {
  return request('/notify/remind/unreadCount', {
    method: 'GET',
  });
}

/** 将未读提醒标记为已读 PUT /notify/remind/{id} */
export async function remindRead(id: number) {
  return request(`/notify/remind/${id}`, {
    method: 'PUT',
  });
}

/** 将所有未读提醒标记为已读 PUT /notify/remind/clearUnread */
export async function remindClearUnread() {
  return request('/notify/remind/clearUnread', {
    method: 'PUT',
  });
}

/** 消息(私信)获取 GET /notify/message/messagePageList */
export async function queryMessagePageList(params: { current: number, pageSize: number }) {
  return request('/notify/message/messagePageList', {
    method: 'GET',
    params
  });
}

/** 指定数目未读私信获取 GET /notify/message/unreadList */
export async function queryUnreadMessageList(params: { count: number}) {
  return request('/notify/message/unreadList', {
    method: 'GET',
    params
  });
}

/** 未读私信数获取 GET /notify/message/unreadCount */
export async function queryUnreadMessageCount() {
  return request('/notify/message/unreadCount', {
    method: 'GET',
  });
}

/** 将未读私信标记为已读 PUT /notify/message/{id} */
export async function messageRead(id: number) {
  return request(`/notify/message/${id}`, {
    method: 'PUT',
  });
}

/** 将所有未读私信标记为已读 PUT /notify/message/clearUnread */
export async function messageClearUnread() {
  return request('/notify/message/clearUnread', {
    method: 'PUT',
  });
}

/** 公告获取 GET /notify/bulletin/bulletinPageList */
export async function queryBulletinPageList(params: { current: number, pageSize: number }) {
  return request('/notify/bulletin/bulletinPageList', {
    method: 'GET',
    params
  });
}

/** 指定数目未读私信获取 GET /notify/bulletin/unreadList */
export async function queryUnreadBulletinList(params: { count: number}) {
  return request('/notify/bulletin/unreadList', {
    method: 'GET',
    params
  });
}

/** 未读公告数获取 GET /notify/bulletin/unreadCount */
export async function queryUnreadBulletinCount() {
  return request('/notify/bulletin/unreadCount', {
    method: 'GET',
  });
}

/** 将未读公告标记为已读 PUT /notify/bulletin/{id} */
export async function bulletinRead(id: number) {
  return request(`/notify/bulletin/${id}`, {
    method: 'PUT',
  });
}

/** 将所有未读公告标记为已读 PUT /notify/bulletin/clearUnread */
export async function bulletinClearUnread() {
  return request('/notify/bulletin/clearUnread', {
    method: 'PUT',
  });
}
