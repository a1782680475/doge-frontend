import { Button, Col, Form, Input, Modal, Row, Space, message } from "antd";
import styles from './index.less';
import { useEffect, useState } from "react";
import { changePassword, sendVerificationCodeForChangePassword, verifyCodeForChangePassword } from "@/services/api/user/user";
import { outLogin } from "@/services/api/login";
import { history, useModel } from 'umi';

export type PasswordChangeDialogProps = {
    email: string,
    open: boolean;
    onCancel: () => void;
};
const PasswordChangeDialog: React.FC<PasswordChangeDialogProps> = (props) => {
    const { setInitialState } = useModel('@@initialState');
    const { open, onCancel } = props;
    const [sendCodeLoading, setSendCodeLoading] = useState<boolean>();
    const [nextLoading, setNextLoading] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [setpForm1] = Form.useForm();
    const [setpForm2] = Form.useForm();
    useEffect(() => {
        if (open) {
            setCurrentStep(0)
        }
        setpForm1.resetFields();
        setpForm2.resetFields();
    }, [open]);

    const loginOut = async () => {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        await outLogin();
        const { query = {}, pathname } = history.location;
        const { redirect } = query;
        if (window.location.pathname !== '/user/login' && !redirect) {
            history.replace({
                pathname: '/user/login',
                search: String({
                    redirect: pathname,
                }),
            });
        }
    };

    const sendVerificationCode = () => {
        if (!sendCodeLoading) {
            setSendCodeLoading(true);
            sendVerificationCodeForChangePassword().then((result) => {
                setSendCodeLoading(false)
                if (result.data.isSuccess) {
                    message.success(`验证码已发送到${props.email}，请在5分钟内完成验证`);

                } else {
                    message.error(result.data.errorMessage);
                }
            });
        }
    };

    const onNextStep = (values: any) => {
        if (!nextLoading) {
            setNextLoading(true);
            verifyCodeForChangePassword(values.verificationCode).then((result) => {
                setNextLoading(false)
                if (result.data.isSuccess) {
                    setCurrentStep(1)
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
        if (!submitLoading) {
            setSubmitLoading(true)
            changePassword(values.password).then((result) => {
                setSubmitLoading(false)
                if (result.data.isSuccess) {
                    message.success('密码已修改，请重新登录')
                    setTimeout(() => {
                        loginOut()
                    }, 3000);
                } else {
                    message.error(result.data.errorMessage);
                }
            });
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        message.error(errorInfo);
    };
    return (<Modal title="密码修改" open={open} maskClosable={false} footer={null} onCancel={onCancel}>
        {currentStep == 0 &&
            (
                <div className={styles.dialog}>
                    <Form
                        name="email"
                        labelCol={{ span: 5 }}
                        autoComplete="off"
                        form={setpForm1}
                        onFinish={onNextStep}
                        onFinishFailed={onNextStepFailed}
                    >
                        <Form.Item
                            label="邮箱"
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
                        name="email"
                        labelCol={{ span: 5 }}
                        autoComplete="off"
                        form={setpForm2}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
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
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="重复新密码"
                        >
                            <Form.Item
                                name="passwordRepate"
                                required={false}
                                rules={[
                                    { required: true, message: '请再次输入新密码!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('两次密码输入不一致!'));
                                        },
                                    }),
                                ]}>
                                <Input.Password />
                            </Form.Item>
                        </Form.Item>
                        <Form.Item>
                            <Row>
                                <Col span={5}></Col>
                                <Button type="primary" loading={submitLoading} htmlType="submit">提交</Button>
                            </Row>
                        </Form.Item>
                    </Form>
                </div>
            )}
    </Modal>);
};

export default PasswordChangeDialog;

function setInitialState(arg0: (s: any) => any) {
    throw new Error("Function not implemented.");
}
