import rsaUtils from '@/utils/rsaUtils';
import { request } from 'umi';

/** 用户列表获取 GET /sys/user/pageList */
export async function queryPageList(params?: { [key: string]: any }) {
  return request('/sys/user/pageList', {
    method: 'GET',
    params
  });
}

/** 用户角色获取 GET /sys/user/roleList */
export async function queryRoleList(params: { id: number }) {
  return request('/sys/user/roleList', {
    method: 'GET',
    params
  });
}

/** 用户新增 POST /sys/user/add */
export async function addUser(data: { username: string, password: string }) {
  return request('/sys/user/add', {
    method: 'POST',
    data: { username: data.username, password: rsaUtils.encrypt(data.password) }
  });
}

/** 用户启用 PUT /sys/user/enable/{id} */
export async function enableUser(id: number) {
  return request(`/sys/user/enable/${id}`, {
    method: 'PUT'
  });
}

/** 用户禁用 PUT /sys/user/disable/{id} */
export async function disableUser(id: number) {
  return request(`/sys/user/disable/${id}`, {
    method: 'PUT',
  });
}

/** 用户角色分配 PUT /sys/user/settingRole */
export async function settingRole(data: { id: number, roleIds: number[] }) {
  return request('/sys/user/settingRole', {
    method: 'PUT',
    data
  });
}

/** 用户批量启用 PUT /sys/user/enableBatch */
export async function enableUserBatch(ids: number[]) {
  return request('/sys/user/enableBatch', {
    method: 'PUT',
    data: ids
  });
}

/** 用户批量禁用 PUT /sys/user/disableBatch */
export async function disableUserBatch(ids: number[]) {
  return request('/sys/user/disableBatch', {
    method: 'PUT',
    data: ids
  });
}

/** 用户账户密码重置 POST /resetPassword */
export async function resetPassword(data: { id: number, password: string }) {
  return request('/sys/user/resetPassword', {
    method: 'POST',
    data: { id: data.id, password: rsaUtils.encrypt(data.password) }
  });
}