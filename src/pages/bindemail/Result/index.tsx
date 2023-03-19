import { bindEmailVerify } from "@/services/api/user/user";
import { Button, Result, Spin } from "antd";
import { useLocation, useRequest, history } from "umi";

const BindEmailResult: React.FC = () => {
    const location = useLocation();
    const { data: verifyResult, loading } = useRequest(() => {
        return bindEmailVerify(location.query.email, location.query.token);
    });
    return (
        <>
            <Spin tip="验证中..." size="large" spinning={loading} />
            {!loading && verifyResult.isSuccess ? (
                <Result
                    status="success"
                    title="邮箱绑定成功!"
                    subTitle="接下您可以使用此邮箱进行密码修改和找回密码等操作。"
                    extra={[
                        <Button type="primary" key="usercenter" onClick={() => {
                            history.push('/workspace');
                        }}>
                            个人中心
                        </Button>
                    ]}
                />
            ) : !loading && !verifyResult.isSuccess ? (
                <Result
                    status="error"
                    title={verifyResult.errorMessage}
                />
            ) : null
            }
        </>
    );
};
export default BindEmailResult;