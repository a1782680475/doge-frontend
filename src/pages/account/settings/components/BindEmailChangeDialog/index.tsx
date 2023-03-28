import { Button, Col, Form, Input, Modal, Row, Space, Steps, message } from "antd";
import styles from './index.less';
import { useEffect, useState } from "react";
import { sendBindEmail, sendVerificationCodeForChangeEmail, verifyCodeForChangeEmail } from "@/services/api/user/user";

export type PasswordChangeDialogProps = {
    email: string,
    open: boolean;
    onCancel: () => void;
};
const BindEmailChangeDialog: React.FC<PasswordChangeDialogProps> = (props) => {
    const { open, onCancel } = props;
    const [sendCodeLoading, setSendCodeLoading] = useState<boolean>();
    const [nextLoading, setNextLoading] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);
    const [emailValidateStatus, setEmailValidateStatus] = useState<"" | "validating" | "success" | "warning" | "error" | undefined>('');
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [setpForm1] = Form.useForm();
    const [setpForm2] = Form.useForm();
    const emailValue = Form.useWatch('newEmail', setpForm2);
    const validatorEmail = (value: string): boolean => {
        if (value) {
            if (/^\w+@[a-z0-9]+(\.[a-z]+){1,3}$/.test(value)) {
                return true
            }
            return false
        }
        return false;
    };
    useEffect(() => {
        if (open) {
            setCurrentStep(0);
            setEmailValidateStatus('');
            setSubmitDisabled(true);
        }
        setpForm1.resetFields();
        setpForm2.resetFields();
    }, [open])
    const sendVerificationCode = () => {
        if (!sendCodeLoading) {
            setSendCodeLoading(true)
            sendVerificationCodeForChangeEmail().then((result) => {
                setSendCodeLoading(false);
                if (result.data.isSuccess) {
                    message.success(`验证码已发送到 ${props.email} ，请在5分钟内完成验证`);

                } else {
                    message.error(result.data.errorMessage);
                }
            });
        }
    }
    const onNextStep = (values: any) => {
        if (!nextLoading) {
            setNextLoading(true);
            verifyCodeForChangeEmail(values.verificationCode).then((result) => {
                setNextLoading(false)
                if (result.data.isSuccess) {
                    setCurrentStep(1);
                } else {
                    message.error(result.data.errorMessage);
                }
            });
        }
    };
    const onNextStepFailed = (errorInfo: any) => {
        message.error(errorInfo);
    };
    const onFinish = (values: any) => {
        setSubmitLoading(true)
        sendBindEmail(values.newEmail).then((result) => {
            setSubmitLoading(false)
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
    return (<Modal title="邮箱修改" open={open} maskClosable={false} footer={null} onCancel={onCancel}>
        {currentStep == 0 &&
            (
                <div className={styles.dialog}>
                    <Form
                        labelCol={{ span: 5 }}
                        autoComplete="off"
                        form={setpForm1}
                        onFinish={onNextStep}
                        onFinishFailed={onNextStepFailed}
                    >
                        <Form.Item
                            label="旧邮箱"
                            name="email"
                        >
                            {props.email}
                        </Form.Item>

                        <Form.Item
                            label="验证码"
                        >
                            <Space>
                                <Form.Item
                                    name="verificationCode"
                                    rules={[{ required: true, message: '请输入验证码!' }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" onClick={sendVerificationCode} loading={sendCodeLoading}>发送</Button>
                                </Form.Item>
                            </Space>

                        </Form.Item>
                        <Form.Item>
                            <Row>
                                <Col span={5}></Col>
                                <Button type="primary" loading={nextLoading} htmlType="submit">下一步</Button>
                            </Row>
                        </Form.Item>
                    </Form>
                </div>
            )}
        {currentStep == 1 &&
            (
                <div className={styles.dialog}>
                    <Form
                        form={setpForm2}
                        labelCol={{ span: 5 }}
                        autoComplete="off"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            label="新邮箱"
                            name="newEmail"
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
            )}
    </Modal>);
};

export default BindEmailChangeDialog;