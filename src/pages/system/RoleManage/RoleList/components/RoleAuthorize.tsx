import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Drawer, Row, Select } from "antd";
import { Form } from "antd";
import PermissionTree from "@/pages/system/components/PermissionTree";
import { queryMenuList } from "@/services/api/system/role";

export type FormValueType = Partial<API.RuleListItem>;

export type RoleAuthorizeProps = {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  visible: boolean;
  id?: number;
};

const RoleAuthorize: React.FC<RoleAuthorizeProps> = (props) => {
  const { onCancel, onSubmit, visible } = props;
  const permissionTreeRef = useRef<any>(PermissionTree);
  const [form] = Form.useForm();
  const { Option } = Select;
  const expandedAll = () => {
    permissionTreeRef.current.expandedAll();
  }
  const retractAll = () => {
    permissionTreeRef.current.retractAll()
  }
  const checkAll = () => {
    permissionTreeRef.current.checkAll()
  }
  const deCheckAll = () => {
    permissionTreeRef.current.deCheckAll()
  }
  const restore = () => {
    permissionTreeRef.current.restore()
  }
  const strictly = () => {
    permissionTreeRef.current.strictly()
  }
  const loosely = () => {
    permissionTreeRef.current.loosely()
  }

  /** 角色页面权限查询 */
  const queryMenus = async (id?: number) => {
    if (id) {
      const result = await queryMenuList({ id });
      return result.data;
    }
    return [];
  }

  useEffect(() => {
    form.resetFields();
    queryMenus(props.id).then((data) => {
      const menuIdArray: number[] = [];
      data.forEach((item: { roleId: number, menuId: number }) => {
        menuIdArray.push(item.menuId);
      });
      form.setFieldValue('permission', menuIdArray)
    });
  }, [props.id])
  return (
    <Drawer
      title="角色授权"
      width="30%"
      placement="right"
      closable={false}
      onClose={onCancel}
      visible={visible}
      key="authorize"
      footer={
        <Row>
          <Col span={12}>
            <Select
              defaultValue="树操作"
              style={{ width: 120 }}
              onSelect={(value: String) => {
                switch (String(value)) {
                  case 'expandedAll':
                    expandedAll();
                    break;
                  case 'retractAll':
                    retractAll();
                    break;
                  case 'checkAll':
                    checkAll();
                    break;
                  case 'deCheckAll':
                    deCheckAll();
                    break;
                  case 'restore':
                    restore();
                    break;
                  case 'strictly':
                    strictly();
                    break;
                  case 'loosely':
                    loosely();
                    break;
                  default:
                    break;
                }
              }}
            >
              <Option value="expandedAll">展开全部</Option>
              <Option value="retractAll">收起全部</Option>
              <Option value="checkAll">全选</Option>
              <Option value="deCheckAll">取消全选</Option>
              <Option value="restore">复原</Option>
              <Option value="strictly">父子关联</Option>
              <Option value="loosely">取消关联</Option>
            </Select>
          </Col>
          <Col span={12}>
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button
                onClick={onCancel}
                style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button
                onClick={async () => {
                  await onSubmit(form.getFieldsValue());
                }}
                type="primary">
                提交
              </Button>
            </div>
          </Col>
        </Row>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ permission: [] }}
      >
        <Form.Item key="permission" name="permission">
          <PermissionTree ref={permissionTreeRef} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default RoleAuthorize;
