import { Button, Col, Form, Input, Modal, Row, Space, message } from "antd";
import styles from './index.less';
import { useEffect, useState } from "react";
import { sendBindEmail } from "@/services/api/user/user";
export type BindEmailDialogProps = {
    open: boolean;
    onCancel: () => void;
};
const BindEmailDialog: React.FC<BindEmailDialogProps> = (props) => {
    const { open, onCancel } = props;
    const [form] = Form.useForm();
    const emailValue = Form.useWatch('email', form);
    const [emailValidateStatus, setEmailValidateStatus] = useState<"" | "validating" | "success" | "warning" | "error" | undefined>('');
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const validatorEmail = (value: string): boolean => {
        if (value) {
            if (/^\w+@[a-z0-9]+(\.[a-z]+){1,3}$/.test(value)) {
                return true
            }
            return false
        }
        return false;
    };
    const onFinish = (values: any) => {
        setSubmitLoading(true);
        sendBindEmail(values.email).then((result) => {
            setSubmitLoading(false);
            if (result.data.isSuccess) {
                message.success('验证邮件已发出，请在48小时内登录邮箱并验证');
                onCancel()
            } else {
                message.error(result.data.errorMessage);
            }
        });
    };

    const onFinishFailed = (errorInfo: any) => {
        message.error(errorInfo);
    };
    useEffect(() => {
        form.resetFields();
        setEmailValidateStatus('');
        setSubmitDisabled(true);
    }, [open])
    return (<Modal title="邮箱绑定" open={open} maskClosable={false} footer={null} onCancel={onCancel}>
        <div className={styles.dialog}>
            <Form
                form={form}
                name="email"
                labelCol={{ span: 5 }}
                autoComplete="off"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="邮箱"
                    name="email"
                    hasFeedback
                    validateStatus={emailValidateStatus}>
                    <Row>
                        <Col span={20}>
                            <Input onChange={() => {
                                if (validatorEmail(emailValue)) {
                                    setEmailValidateStatus('success');
                                    setSubmitDisabled(false);
                                } else {
                                    setEmailValidateStatus('');
                                    setSubmitDisabled(true);
                                }
                            }} />
                        </Col>
                    </Row>
                </Form.Item>

                <Form.Item>
                    <Row>
                        <Col span={5}></Col>
                        <Button type="primary" loading={submitLoading} disabled={submitDisabled} htmlType="submit">发送绑定邮件</Button>
                    </Row>
                </Form.Item>
            </Form>
        </div>
    </Modal>);
}
export default BindEmailDialog;