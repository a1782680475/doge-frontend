import { ModalForm } from "@ant-design/pro-form";
import { Form, Input } from "antd";
import { useEffect } from "react";

export type FormValueType = Partial<API.RuleListItem>;

export type ResetPasswordProps = {
    onCancel: () => void;
    onSubmit: (values: FormValueType) => Promise<void>;
    modalVisible: boolean;
    id?: number;
};

const ResetPassword: React.FC<ResetPasswordProps> = (props) => {
    const { onCancel, onSubmit, modalVisible } = props;
    const [form] = Form.useForm();
    useEffect(() => {
        if (modalVisible) {
            form.resetFields();
        }
    });

    return (
        <ModalForm
            form={form}
            key="roleSetting"
            initialValues={{ password: 123456 }}
            title="密码重置"
            width="500px"
            open={modalVisible}
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            modalProps={{
                onCancel: () => {
                    onCancel();
                }
            }}
            onFinish={onSubmit}
        >
            <Form.Item
                label="新密码"
                name="password"
                required={false}
                rules={[
                    { required: true, message: '请输入新密码!' },
                    { min: 6, message: '密码不能低于6位' }
                ]}
            >
                <Input allowClear={true} />
            </Form.Item>

        </ModalForm>
    );
}

export default ResetPassword;