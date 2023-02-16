import React, {useState} from 'react';
import {UploadOutlined} from '@ant-design/icons';
import {Button, Input, Upload, message} from 'antd';
import ImgCrop from 'antd-img-crop';
import ProForm, {
  ProFormDependency,
  ProFormFieldSet,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import {useRequest, useModel} from 'umi';

import styles from './BaseView.less';
import {queryUser, updateUserInfo} from "@/services/api/user/user";
import {queryCity, queryProvince} from "@/services/api/dictionary/area";
import HeadPhoto from "@/components/HeadPhoto";
import {fileUpload} from "@/services/api/file/upload";
import {phone} from 'phone';

const validatorPhone = (rule: any, values: string[], callback: (message?: string) => void) => {
  if (values[1]) {
    if (!phone(values[1]).isValid) {
      callback('电话号码格式不正确!');
    }
  }
  callback();
};

const validatorEmail = (rule: any, value: string, callback: (message?: string) => void) => {
  if (value) {
    if (!/^\w+@[a-z0-9]+(\.[a-z]+){1,3}$/.test(value)) {
      callback('邮箱格式不正确!');
    }
  }
  callback();
};

const BaseView: React.FC = () => {
  const {initialState} = useModel('@@initialState');
  const [fileList, setFileList] = useState<any[]>([]);
  const [headPhoto, setHeadPhoto] = useState<string>('');
  const {data: userInfo, loading} = useRequest(() => {
    return queryUser(initialState?.currentUser?.userId);
  }, {
    onSuccess: (result) => {
      setHeadPhoto(result.avatar);
    },
  });

  // 头像组件 方便以后独立，增加裁剪之类的功能
  const AvatarView = () => (
    <>
      <div className={styles.avatar_title}>头像</div>
      <div className={styles.avatar}>
        <HeadPhoto size={144} src={headPhoto}/>
      </div>
      <ImgCrop
        shape="round"
        grid={true}
        quality={1}
        maxZoom={5}
        rotate
        onModalOk={(file) => {
          const formData = new FormData();
          formData.append('file', file);
          return fileUpload(formData).then((result) => {
            setHeadPhoto(result.data.url);
            return result.data.url;
          }).catch(() => {
            return false;
          })
        }}>
        <Upload
          showUploadList={false}
          beforeUpload={file => {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isBMP = file.type === 'image/bmp';
            const isGIF = file.type === 'image/gif';
            const isWEBP = file.type === 'image/webp';
            const isPic = isJPG || isPNG || isBMP || isGIF || isWEBP;
            if (!isPic) {
              message.error('请上传图片文件!');
              return false;
            }
            return true;
          }}
          onChange={({fileList: currentFileList}) => {
            setFileList(currentFileList);
          }}
          fileList={fileList}
          maxCount={1}
        >
          <div className={styles.button_view}>
            <Button>
              <UploadOutlined/>
              更换头像
            </Button>
          </div>
        </Upload>
      </ImgCrop>
    </>
  );

  const handleFinish = async (values: any) => {
    updateUserInfo(userInfo.id,
      {
        ...values,
        avatar: headPhoto,
        country: values.country ? values.country.label : null,
        provinceCode: values.province ? values.province.value : null,
        province: values.province ? values.province.label : null,
        cityCode: values.city ? values.city.value : null,
        city: values.city ? values.city.label : null,
        phone: values.phone ? values.phone[1] : ''
      }
    ).then(() => {
      message.success('更新基本信息成功');
    });
  };
  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                resetButtonProps: {
                  style: {
                    display: 'none',
                  },
                },
                submitButtonProps: {
                  children: '更新基本信息',
                },
              }}
              initialValues={{
                ...userInfo,
                country: {value: userInfo?.country, label: userInfo?.country},
                province: {value: userInfo?.provinceCode, label: userInfo?.province},
                city: {value: userInfo?.cityCode, label: userInfo?.city},
                phone: ['+86', userInfo?.phone],
              }}
              hideRequiredMark
            >
              <ProFormText
                width="md"
                name="username"
                label="用户名"
                disabled={true}
              />
              <ProFormText
                width="md"
                name="nickName"
                label="昵称"
                rules={[
                  {
                    required: true,
                    message: '请输入您的昵称!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="email"
                label="邮箱"
                allowClear={true}
                rules={[
                  {
                    required: false,
                  },
                  {validator: validatorEmail},
                ]}
              />
              <ProFormTextArea
                name="profile"
                label="个人简介"
                placeholder="个人简介（100字以内）"
                fieldProps={{autoSize: {minRows: 3, maxRows: 5}, showCount: true, maxLength: 100, allowClear: true}}
              />
              <ProFormSelect
                width="sm"
                name="country"
                label="国家/地区"
                options={[
                  {
                    label: '中国',
                    value: 'China',
                  },
                ]}
                fieldProps={{labelInValue: true}}
              />

              <ProForm.Group title="所在省市" size={8}>
                <ProFormSelect
                  width="sm"
                  fieldProps={{
                    labelInValue: true,
                  }}
                  name="province"
                  className={styles.item}
                  request={async () => {
                    return queryProvince().then(({data}) => {
                      return data.map((item: { title: string; value: number; }) => {
                        return {
                          label: item.title,
                          value: item.value,
                        };
                      });
                    });
                  }}
                />
                <ProFormDependency name={['province']}>
                  {({province}) => {
                    return (
                      <ProFormSelect
                        params={{
                          provinceCode: province?.value,
                        }}
                        name="city"
                        width="sm"
                        fieldProps={{
                          labelInValue: true,
                        }}
                        disabled={!province}
                        className={styles.item}
                        request={async () => {
                          const provinceCode = province.key ?? userInfo.provinceCode;
                          if (!provinceCode) {
                            return [];
                          }
                          return queryCity(provinceCode || 0).then(({data}) => {
                            return data.map((item: { title: string; value: number; }) => {
                              return {
                                label: item.title,
                                value: item.value,
                              };
                            });
                          });
                        }}
                      />
                    );
                  }}
                </ProFormDependency>
              </ProForm.Group>
              <ProFormText
                width="md"
                name="address"
                label="街道地址"
                allowClear={true}
              />
              <ProFormFieldSet
                name="phone"
                label="联系电话"
                rules={[
                  {
                    required: false,
                  },
                  {validator: validatorPhone},
                ]}
              >
                <Input className={styles.area_code} disabled={true}/>
                <Input className={styles.phone_number} allowClear={true}/>
              </ProFormFieldSet>
            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView/>
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;
