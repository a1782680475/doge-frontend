import { request } from 'umi';
import rsaUtils from '@/utils/rsaUtils'

/** 用户账户绑定邮箱验证 POST /auth/bindEmailVerify */
export async function bindEmailVerify(email: string, token: string) {
    return request('/auth/bindEmailVerify', {
        method: 'POST',
        data: { email, token }
    });
}

/** 用户账户密码找回验证码发送 PUT /auth/findPassword/sendVerificationCode */
export async function sendVerificationCodeForFindPassword(username: string) {
    return request('/auth/findPassword/sendVerificationCode', {
        method: 'PUT',
        data: username
    });
}

/** 用户账户绑定邮箱找回验证码验证 POST /auth/findPassword/verificationCodeVerify */
export async function verifyCodeForFindPassword(token: string, code: string) {
    return request('/auth/findPassword/verificationCodeVerify', {
        method: 'POST',
        data: { token, code }
    });
}

/** 用户账户密码修改 POST /auth/findPassword/changePassword */
export async function changePasswordForFindPassword(token: string, password: string) {
    return request('/auth/findPassword/changePassword', {
        method: 'POST',
        data: { token, password: rsaUtils.encrypt(password) }
    });
}