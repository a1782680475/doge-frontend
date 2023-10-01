import React, { useEffect } from 'react';
import { ModalForm, ProFormText } from "@ant-design/pro-form";
import { Form } from "antd";
import RichTextEditor from '@/components/RichTextEditor';

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
      title="新建公告"
      width="700px"
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
        label="标题"
        placeholder="请输入标题（50字以内）"
        rules={[
          {
            required: true,
            message: '标题为必填项',
          },
          {
            max: 50, message: '标题不能多于50个字符'
          }
        ]}
        width="lg"
        name="title"
      />
      <Form.Item name="content" label="内容">
        <RichTextEditor />
      </Form.Item>
    </ModalForm>
  );
};

export default CreateForm;
