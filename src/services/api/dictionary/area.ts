import {request} from 'umi';

/** 省份获取 GET /area/provinceList */
export async function queryProvince() {
  return request('/area/provinceList', {
    method: 'GET',
  });
}

/** 地州市获取 GET /area/cityList */
export async function queryCity(provinceCode: number) {
  return request('/area/cityList', {
    method: 'GET',
    params: {provinceCode}
  });
}

/** 区县市获取 GET /area/areaList */
export async function queryArea(cityCode: number) {
  return request('/area/areaList', {
    method: 'GET',
    params: {cityCode}
  });
}
