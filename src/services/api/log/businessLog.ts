import {request} from 'umi';

/** 业务日志获取 GET /businessLog/pageList */
export async function queryBusinessLog(params?: { [key: string]: any }) {
  return request('/businessLog/pageList', {
    method: 'GET',
    params
  });
}

/** 业务日志删除 DELETE /businessLog/{id} */
export async function deleteBusinessLog(id: number) {
  return request(`/businessLog/${id}`, {
    method: 'DELETE'
  });
}

/** 业务日志批量删除 DELETE /businessLog/deleteBatch */
export async function deleteBusinessLogBatch(ids: number[]) {
  return request('/businessLog/deleteBatch', {
    method: 'DELETE',
    data: ids
  });
}

/** 业务日志清空 DELETE /businessLog/clear */
export async function clearBusinessLog() {
  return request('/businessLog/clear', {
    method: 'DELETE',
  });
}
