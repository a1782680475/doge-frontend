import {request} from 'umi';

/** 角色列表获取 GET /sys/role/pageList */
export async function queryPageList(params?: { [key: string]: any }) {
  return request('/sys/role/pageList', {
    method: 'GET',
    params,
  });
}

/** 角色选择列表获取 GET /sys/role/selector */
export async function getSelector() {
  return request('/sys/role/selector', {
    method: 'GET'
  });
}

/** 角色页面权限获取 GET /sys/user/menuList */
export async function queryMenuList(params: { id: number}) {
  return request('/sys/role/menuList', {
    method: 'GET',
    params
  });
}

/** 角色新增 POST /sys/role/add */
export async function addRole(data?: { [key: string]: any }) {
  return request('/sys/role/add', {
    method: 'POST',
    data,
    skipErrorHandler: true
  });
}

/** 角色修改 PUT /sys/role/update */
export async function updateRole(data?: { [key: string]: any }) {
  return request('/sys/role/update', {
    method: 'PUT',
    data,
    skipErrorHandler: true
  });
}

/** 角色授权 PUT /sys/user/roleAuthorize */
export async function roleAuthorize(data: { id: number, menuIds: number[] }) {
  return request('/sys/role/roleAuthorize', {
    method: 'PUT',
    data
  });
}

/** 角色删除 DELETE /sys/role/{id} */
export async function deleteRole(id: number) {
  return request(`/sys/role/${id}`, {
    method: 'DELETE'
  });
}

/** 用户批量删除 DELETE /sys/role/deleteBatch */
export async function deleteRoleBatch(ids: number[]) {
  return request('/sys/role/deleteBatch', {
    method: 'DELETE',
    data: ids
  });
}
