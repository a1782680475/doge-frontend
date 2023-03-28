import { request } from 'umi';
import storage from "@/utils/storage";
import rsaUtils from '@/utils/rsaUtils'

/** 登录接口 POST /auth/login */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  const newPassword = rsaUtils.encrypt(body.password);
  if (newPassword) {
    body.password = newPassword;
    return request('/auth/login', {
      method: 'POST',
      data: body,
      ...(options || {}),
      skipErrorHandler: true,
    });
  }
}

/** 登录验证码获取（用户名/密码登录） */
export async function queryCaptcha() {
  return request('/auth/captcha', {
    method: 'GET',
    authorization: false
  });
}

/** 获取当前的用户 GET /auth/user */
export async function user(options?: { [key: string]: any }) {
  return request('/auth/user', {
    method: 'GET',
    options,
  });
}

/** 注销接口 POST /auth/outLogin */
export async function outLogin() {
  storage.clearToken();
  return null;
}