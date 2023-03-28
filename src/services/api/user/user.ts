import rsaUtils from '@/utils/rsaUtils';
import { request } from 'umi';

/** 用户获取 GET /user/info */
export async function queryUser() {
  return request('/user/info', {
    method: 'GET',
  });
}

/** 个人资料更新 PUT /user/info */
export async function updateUserInfo(userInfo: API.UserInfo) {
  return request('/user/info', {
    method: 'PUT',
    data: userInfo
  });
}

/** 用户账户绑定信息获取 GET /user/securityInfo */
export async function querySecurityInfo() {
  return request('/user/securityInfo', {
    method: 'GET',
  });
}

/** 用户账户绑定邮箱邮件发送 PUT /user/bindEmailVerify/sendEmail/{email} */
export async function sendBindEmail(email: string) {
  return request(`/user/bindEmailVerify/sendEmail/${email}`, {
    method: 'PUT',
  });
}


/** 用户账户绑定邮箱更换验证码发送 PUT /user/changeEmail/sendVerificationCode */
export async function sendVerificationCodeForChangeEmail() {
  return request('/user/changeEmail/sendVerificationCode', {
    method: 'PUT',
  });
}

/** 用户账户绑定邮箱修改验证码验证 POST /user/changeEmail/verificationCodeVerify */
export async function verifyCodeForChangeEmail(code: string) {
  return request('/user/changeEmail/verificationCodeVerify', {
    method: 'POST',
    data: code
  });
}

/** 用户账户密码修改验证码发送 PUT /user/changePassword/sendVerificationCode */
export async function sendVerificationCodeForChangePassword() {
  return request('/user/changePassword/sendVerificationCode', {
    method: 'PUT',
  });
}

/** 用户账户密码修改验证码验证 POST /user/changePassword/verificationCodeVerify */
export async function verifyCodeForChangePassword(code: string) {
  return request('/user/changePassword/verificationCodeVerify', {
    method: 'POST',
    data: code
  });
}

/** 用户账户密码修改 POST /user/changePassword */
export async function changePassword(password: string) {
  return request('/user/changePassword', {
    method: 'POST',
    data: rsaUtils.encrypt(password)
  });
}