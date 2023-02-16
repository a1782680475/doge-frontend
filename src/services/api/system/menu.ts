import {request} from 'umi';

/** 菜单树形列表获取 GET /sys/menu/treeList */
export async function queryList(params?: { [key: string]: any }) {
  return request('/sys/menu/treeList', {
    method: 'GET',
    params,
  });
}

/** 菜单树形选择器获取 GET /sys/menu/treeSelector */
export async function getTreeSelector(params?: { [key: string]: any }) {
  return request('/sys/menu/treeSelector', {
    method: 'GET',
    params,
  });
}

/** 菜单树获取 GET /sys/menu/tree */
export async function getTree(params?: { [key: string]: any }) {
  return request('/sys/menu/tree', {
    method: 'GET',
    params,
  });
}

/** 菜单新增 POST /sys/menu/add */
export async function addMenu(data?: { [key: string]: any }) {
  return request('/sys/menu/add', {
    method: 'POST',
    data,
    skipErrorHandler: true,
  });
}

/** 菜单修改 PUT /sys/menu/update */
export async function updateMenu(data?: { [key: string]: any }) {
  return request('/sys/menu/update', {
    method: 'PUT',
    data,
    skipErrorHandler: true,
  });
}

/** 指定菜单详情获取 GET /sys/menu/{id} */
export async function getMenu(id: number) {
  return request(`/sys/menu/${id}`, {
    method: 'GET',
  });
}

/** 菜单删除 DELETE /sys/menu/{id} */
export async function deleteMenu(id: number) {
  return request(`/sys/menu/${id}`, {
    method: 'DELETE'
  });
}

/** 菜单批量删除 DELETE /sys/menu/deleteBatch */
export async function deleteMenuBatch(ids: number[]) {
  return request('/sys/menu/deleteBatch', {
    method: 'DELETE',
    data: ids
  });
}
