import {Form, Select} from "antd";
import {getSelector} from '@/services/api/system/role';
import React from "react";
import {useRequest} from 'umi';

interface PermissionTreeSelectProps {
  hidden?: boolean;
  name?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  onSelect?: (key: number) => void;
}

const RoleSelect: React.FC<PermissionTreeSelectProps> = (props) => {
  const {Option} = Select;
  const {data: selectData} = useRequest(getSelector,{
    initialData:[],
    cacheKey: 'roleSelect'
  });
  return (
    <Form.Item
      key="role"
      label={props.label ?? '角色选择'}
      hidden={props.hidden}
      name={props.name ?? 'role'}
      tooltip="支持设置多个角色"
    >
      <Select
        allowClear={true}
        placeholder={props.placeholder ?? '请选择角色'}
        disabled={props.disabled ?? false}
        mode="multiple"
      >
        {selectData.map((item: any) => {
          return (
            <Option key={item.value} value={item.value}>{item.title}</Option>
          )
        })}
      </Select>
    </Form.Item>
  );
};
export default RoleSelect;
