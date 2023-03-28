import { Button, Form, Input, Space, Steps, message } from 'antd';
import styles from './index.less';
import { useState } from 'react';
import { history, Link, useModel } from 'umi';
import { changePasswordForFindPassword, sendVerificationCodeForFindPassword, verifyCodeForFindPassword } from '@/services/api/auth';
import { outLogin } from '@/services/api/login';


const FindPassword: React.FC = () => {
    const { setInitialState } = useModel('@@initialState');
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [setp1SubmitLoading, setSetp1SubmitLoading] = useState<boolean>(false);
    const [setp2SubmitLoading, setSetp2SubmitLoading] = useState<boolean>(false);
    const [setp3SubmitLoading, setSetp3SubmitLoading] = useState<boolean>(false);
    const [setpForm1] = Form.useForm();
    const [setpForm2] = Form.useForm();
    const [setpForm3] = Form.useForm();
    const [verifyToken, setVerifyToken] = useState<string>('');
    const [submitToken, setSubmitToken] = useState<string>('');
    const onStep1Finish = (values: any) => {
        if (!setp1SubmitLoading) {
            setSetp1SubmitLoading(true);
            sendVerificationCodeForFindPassword(values.username).then((result) => {
                setSetp1SubmitLoading(false);
                if (result.data.isSuccess) {
                    message.success(`验证码已发送到 ${result.data.email} ，请在5分钟内完成验证`);
                    setVerifyToken(result.data.token);
                    setCurrentStep(1);
                } else {
                    message.error(result.data.errorMessage);
                }
            });
        }
    };
    const onStep2Finish = (values: any) => {
        if (!setp2SubmitLoading) {
            setSetp2SubmitLoading(true);
            verifyCodeForFindPassword(verifyToken, values.verificationCode).then((result) => {
                setSetp2SubmitLoading(false);
                if (result.data.isSuccess) {
                    setSubmitToken(result.data.token);
                    setSetp2SubmitLoading(false);
                    setCurrentStep(2);
                } else {
                    message.error(result.data.errorMessage);
                }
            });
        }
    };

    const onStep3Finish = (values: any) => {
        if (!setp3SubmitLoading) {
            setSetp3SubmitLoading(true)
            changePasswordForFindPassword(submitToken, values.password).then((result) => {
                setSetp3SubmitLoading(false)
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

    const onFinishFailed = (errorInfo: any) => {
        message.error(errorInfo);
    };
    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.top}>
                    <div className={styles.header}>
                        <span>
                            <img className={styles.logo} alt="logo" src="/logo.svg" />
                        </span>
                        <Link to='/'>
                            <span className={styles.title}>后台管理系统</span>
                        </Link>
                    </div>
                </div>
                <Steps
                    size="small"
                    current={currentStep}
                    style={{ marginTop: 24 }}
                    items={[
                        {
                            title: '输入用户名',
                        },
                        {
                            title: '邮箱验证',
                        },
                        {
                            title: '重设密码',
                        },
                    ]}
                />
                {currentStep == 0 &&
                    (
                        <Form
                            style={{ marginTop: 35 }}
                            form={setpForm1}
                            onFinish={onStep1Finish}
                            onFinishFailed={onFinishFailed}
                        >
                            <Form.Item
                                label="用户名"
                                name="username"
                                rules={[{ required: true, message: '请输入要找回密码的账户用户名!' }]}
                                required={false}
                            >
                                <Input />
                            </Form.Item>

                        </Form>
                    )}
                {currentStep == 1 &&
                    (
                        <Form
                            style={{ marginTop: 35 }}
                            form={setpForm2}
                            onFinish={onStep2Finish}
                            onFinishFailed={onFinishFailed}
                        >
                            <Form.Item
                                label="邮箱验证码"
                                name="verificationCode"
                                rules={[{ required: true, message: '请输入邮箱验证码!' }]}
                                required={false}
                            >
                                <Input />
                            </Form.Item>

                        </Form>
                    )}
                {currentStep == 2 && (
                    <Form
                        labelCol={{ span: 5 }}
                        style={{ marginTop: 35 }}
                        name="password"
                        autoComplete="off"
                        form={setpForm3}
                        onFinish={onStep3Finish}
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
                    </Form>
                )}
                <div style={{ marginTop: 48 }}>
                    {currentStep == 0 && (
                        <Button type="primary" onClick={() => {
                            setpForm1.submit();
                        }} loading={setp1SubmitLoading}>
                            下一步
                        </Button>
                    )}
                    {currentStep == 1 && (
                        <>
                            <Button type="primary" onClick={() => {
                                setpForm2.submit();
                            }} loading={setp2SubmitLoading}>
                                下一步
                            </Button>
                            <Button style={{ margin: '0 8px' }} onClick={() => {
                                setCurrentStep(0);
                            }}>
                                上一步
                            </Button>
                        </>
                    )}
                    {currentStep == 2 && (
                        <Button type="primary" onClick={() => {
                            setpForm3.submit();
                         }}>
                            提交
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FindPassword;