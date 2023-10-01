import React, { useEffect } from 'react';
import { ModalForm, ProFormText } from "@ant-design/pro-form";
import { Form } from "antd";

export type FormValueType = Partial<API.RuleListItem>;

export type CreateFormProps = {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  modalVisible: boolean;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { onCancel, onSubmit, modalVisible } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (modalVisible) {
      form.resetFields();
    }
  }, [modalVisible])
  return (
    <ModalForm
      form={form}
      key="create"
      title="新建用户"
      width="500px"
      visible={modalVisible}
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ username: '', password: '123456' }}
      modalProps={{
        onCancel: () => {
          onCancel();
        }
      }}
      onFinish={onSubmit}
    >
      <ProFormText
        label="用户名"
        placeholder="请输入用户名"
        rules={[
          {
            required: true,
            message: '用户名为必填项',
          },
          ({ }) => ({
            validator(_, value) {
              const patrn = /^[a-zA-Z][a-zA-Z0-9_]+$/;
              if (patrn.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('用户名只能由字母、数字、下划线组成，且必须以字母开头'));
            },
          }),
          {
            min: 4, max: 20, message: '用户名不能短于4个字符长于20个字符'
          }
        ]}
        width="md"
        name="username"
      />
      <ProFormText
        label="密码"
        tooltip="用户初始密码为123456"
        width="md"
        name="password"
        disabled={true}
      />
    </ModalForm>
  );
};

export default CreateForm;
