import React, {useEffect} from 'react';
import {ModalForm, ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import {Form} from "antd";

export type FormValueType = Partial<API.RoleListItem>;

export type UpdateFormProps = {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  modalVisible: boolean;
  values: FormValueType;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const {onCancel, onSubmit, modalVisible, values} = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if(modalVisible) {
      form.resetFields();
    }
  }, [modalVisible])
  return (
    <ModalForm
      form={form}
      key="edit"
      title="编辑角色"
      width="500px"
      visible={modalVisible}
      layout="horizontal"
      labelCol={{span: 6}}
      wrapperCol={{span: 16}}
      initialValues={values}
      modalProps={{
        onCancel: () => {
          onCancel();
        }
      }}
      onFinish={onSubmit}
    >
      <ProFormText
        label="id"
        width="md"
        hidden={true}
        name="id"
      />
      <ProFormText
        key="roleName"
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
        key="roleCode"
        label="角色编码"
        placeholder="请输入角色编码"
        rules={[
          {
            required: true,
            message: '角色编码为必填项',
          },
        ]}
        width="md"
        name="roleCode"
        disabled={true}
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

export default UpdateForm;
