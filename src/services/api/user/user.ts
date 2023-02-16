import {request} from 'umi';

/** 用户获取 GET /user/{id} */
export async function queryUser(id?: number) {
  return request(`/user/${id}`, {
    method: 'GET',
  });
}

/** 个人资料更新 PUT /user/{id} */
export async function updateUserInfo(id: number, userInfo: API.UserInfo) {
  return request(`/user/${id}`, {
    method: 'PUT',
    data: userInfo
  });
}
