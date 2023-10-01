import { request } from 'umi';

/** 公告列表获取 GET /msg/bulletin/pageList */
export async function queryBulletinPageList(params?: { [key: string]: any }) {
  return request('/msg/bulletin/pageList', {
    method: 'GET',
    params,
  });
}
/** 公告获取 GET /msg/bulletin/{id} */
export async function queryBulletin(id: number) {
  return request(`/msg/bulletin/${id}`, {
    method: 'GET',
  });
}
/** 公告新增 POST /msg/bulletin/add */
export async function addBulletin(data: { title: string, content: string }) {
  return request('/msg/bulletin/add', {
    method: 'POST',
    data
  });
}

/** 公告删除 DELETE /msg/bulletin/{id} */
export async function deleteBulletin(id: number) {
  return request(`/msg/bulletin/${id}`, {
    method: 'DELETE'
  });
}
