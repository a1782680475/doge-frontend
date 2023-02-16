import React, {useEffect, useRef, useState} from 'react';
import {ModalForm, ProFormRadio, ProFormSwitch, ProFormText, ProFormDigit, ProFormTextArea} from "@ant-design/pro-form";
import {Form} from "antd";
import styles from "@/pages/system/MenuManage/MenuList/index.less";
import PermissionTreeSelect from "@/pages/system/components/PermissionTreeSelect";
import {IconSelect} from "@/components/IconSelect";

export type FormValueType = Partial<API.MenuListItem>;

export type UpdateFormProps = {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  modalVisible: boolean;
  values: FormValueType;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const {onCancel, onSubmit, modalVisible, values} = props;
  const [currentType, setCurrentType] = useState<number>(1);
  const [form] = Form.useForm();
  const permissionTreeSelectRef = useRef<any>(PermissionTreeSelect);
  /** 图标选择完毕 */
  const handleIconSelectOK = (icon: string) => {
    form.setFieldsValue({icon});
  }

  /** 父级菜单选择完毕 */
  const onPermissionSelect = (key: number) => {
    if (permissionTreeSelectRef.current) {
      const sort = permissionTreeSelectRef.current.getSelected(key).childMaxSort + 1;
      form.setFieldsValue({sort})
    }
  }

  /** 当前是否为一级菜单（目录添加） */
  const isMenu = () => {
    return currentType === 1;
  }

  /** 当前是否为按钮（目录添加） */
  const isButton = () => {
    return currentType === 3;
  }
  useEffect(() => {
    if (modalVisible) {
      setCurrentType(values.type ?? 0);
      form.resetFields();
    }
  }, [modalVisible])
  return (
    <ModalForm
      title="编辑菜单"
      form={form}
      width="600px"
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
      initialValues={values}
    >
      <ProFormText
        label="id"
        width="md"
        hidden={true}
        name="id"
      />
      <div className={styles.modalFormBody}>
        <ProFormRadio.Group
          name="type"
          label="菜单类型"
          disabled={true}
          tooltip="类型一经确定无法修改"
          options={[
            {
              label: '一级菜单',
              value: 1,
            },
            {
              label: '二级菜单',
              value: 2,
            },
            {
              label: '按钮',
              value: 3,
            },
          ]}
          fieldProps={{
            onChange: (event) => {
              const type = event.target.value;
              setCurrentType(type);
            }
          }}
        />
        <Form.Item key="pid" label="父级菜单" hidden={isMenu()} name="pid">
          <PermissionTreeSelect
            placeholder="请选择父级菜单"
            ref={permissionTreeSelectRef}
            onSelect={onPermissionSelect}
          />
        </Form.Item>
        <ProFormText
          label="菜单名称"
          placeholder="请输入菜单名称"
          rules={[
            {
              required: true,
              message: '菜单名称为必填项',
            },
          ]}
          width="md"
          name="menuName"
        />
        <ProFormText
          label="请求地址"
          placeholder="请输入请求地址"
          rules={[
            {
              required: false,
            },
          ]}
          width="md"
          name="path"
          hidden={isButton()}
        />
        <ProFormText
          label="重定向"
          placeholder="请输入重定向地址"
          rules={[
            {
              required: false,
            },
          ]}
          width="md"
          name="redirect"
          hidden={isButton()}
        />
        <ProFormText
          label="权限标识"
          tooltip="如：sys:menu"
          placeholder="请输入权限标识"
          rules={[
            {
              required: true,
            },
          ]}
          width="md"
          name="permission"
        />
        <IconSelect onOk={handleIconSelectOK} hidden={!isMenu()} iconName={values.icon}/>
        <ProFormDigit
          label="排序"
          placeholder="请输入排序"
          rules={[
            {
              required: true,
              message: '排序为必填项',
            },
          ]}
          width="md"
          name="sort"
          hidden={isButton()}
          min={1}
        />
        <ProFormTextArea
          label="备注"
          placeholder="请输入备注（200字以内）"
          width="md"
          name="remark"
          fieldProps={{
            maxLength: 200,
            showCount: true,
          }}
        />
        <ProFormSwitch name="visible" label="是否显示" fieldProps={{checkedChildren: '是', unCheckedChildren: '否'}}/>
        <ProFormSwitch name="frame" label="是否外链" fieldProps={{checkedChildren: '是', unCheckedChildren: '否'}}
                       hidden={isButton()}/>
        <ProFormSwitch name="cache" label="是否缓存" fieldProps={{checkedChildren: '是', unCheckedChildren: '否'}}
                       hidden={isButton()}/>
      </div>
    </ModalForm>
  );
};

export default UpdateForm;
