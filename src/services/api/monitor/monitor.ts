import {request} from 'umi';

/** 服务器信息获取 GET /monitor/server */
export async function queryServerInfo() {
  return request('/monitor/server', {
    method: 'GET'
  });
}

/** Redis信息获取 GET /monitor/redis */
export async function queryRedisInfo() {
  return request('/monitor/redis', {
    method: 'GET'
  });
}
