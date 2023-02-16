import React, {useEffect} from 'react';
import {ModalForm, ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import {Form} from "antd";

export type FormValueType = Partial<API.RuleListItem>;

export type CreateFormProps = {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  modalVisible: boolean;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const {onCancel, onSubmit, modalVisible} = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if(modalVisible) {
      form.resetFields();
    }
  }, [modalVisible])
  return (
    <ModalForm
      form={form}
      key="create"
      title="新建角色"
      width="500px"
      visible={modalVisible}
      layout="horizontal"
      labelCol={{span: 6}}
      wrapperCol={{span: 16}}
      modalProps={{
        onCancel: () => {
          onCancel();
        }
      }}
      onFinish={onSubmit}
    >
      <ProFormText
        label="角色名称"
        placeholder="请输入角色名称"
        rules={[
          {
            required: true,
            message: '角色名称为必填项',
          },
        ]}
        width="md"
        name="roleName"
      />
      <ProFormText
        label="角色编码"
        tooltip="角色编码一经确定不可修改"
        placeholder="请输入角色编码"
        rules={[
          {
            required: true,
            message: '角色编码为必填项',
          },
        ]}
        width="md"
        name="roleCode"
      />
      <ProFormTextArea
        key="remark"
        label="备注"
        placeholder="请输入备注（200字以内）"
        width="md"
        name="remark"
        fieldProps={{
          maxLength: 200,
          showCount: true,
        }}
      />
    </ModalForm>
  );
};

export default CreateForm;
