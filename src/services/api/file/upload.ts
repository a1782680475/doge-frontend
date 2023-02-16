import {request} from 'umi';

/** 基本文件上传 POST /common/upload/file */
export async function fileUpload(formData: FormData) {
  return request('/common/upload/file', {
    method: 'POST',
    isUpload: true,
    data: formData
  });
}
