import React, {useEffect, useState} from 'react';
import {ModalForm} from "@ant-design/pro-form";
import {Form} from "antd";
import RoleSelect from "@/pages/system/components/RoleSelect";
import {queryRoleList} from "@/services/api/system/user";

export type FormValueType = Partial<API.RuleListItem>;

export type RoleSettingProps = {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  modalVisible: boolean;
  id?: number;
};

/** 用户角色列表查询 */
const queryRoles = async (id?: number) => {
  if (id) {
    const result = await queryRoleList({id});
    return result.data;
  }
  return [];
}

const RoleSetting: React.FC<RoleSettingProps> = (props) => {
  const {onCancel, onSubmit, modalVisible} = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (modalVisible) {
      form.resetFields();
    }
    queryRoles(props.id).then((data) => {
      const roleIdArray: number[] = [];
      data.forEach((item: { userId: number, roleId: number }) => {
        roleIdArray.push(item.roleId);
      });
      form.setFieldValue('role',roleIdArray);
    });
  }, [modalVisible])
  return (
    <ModalForm
      form={form}
      key="roleSetting"
      initialValues={{role: []}}
      title="角色分配"
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
      <RoleSelect></RoleSelect>
      <div style={{height: 50}}></div>
    </ModalForm>
  );
};

export default RoleSetting;
