import React, {useState, useEffect, useImperativeHandle, forwardRef} from 'react';
import {useRequest} from 'umi';
import {Input} from 'antd';
import {SafetyCertificateOutlined} from '@ant-design/icons';
import {queryCaptcha} from '@/services/api/login';
import {useIntl} from 'umi';
import styles from './index.less';
// eslint-disable-next-line import/no-absolute-path
import loading from '/public/loading.gif';

interface CaptchaInputValue {
  // 用户标识，因为前后端分离无法标识用户，所以依靠此字段将验证码与用户作关联
  captchaKey?: string;
  // 用户输入的验证码
  captchaCode?: string;
}

// 为了使用antd的form验证组件，value和onChange这两个标准属性是必需的
interface CaptchaInputProps {
  value?: CaptchaInputValue;
  onChange?: (value: CaptchaInputValue) => void;
}

const ImageCaptcha = (props: CaptchaInputProps, ref: any) => {
  const intl = useIntl();
  const [imageData, setImageData] = useState<string>('');
  const [captchaCode, setCaptchaCode] = useState<string>('');
  const [captchaKey, setCaptchaKey] = useState<string>('');

  // 触发改变。
  // 这里之所以需要参数将两个值传递过来,是因为在触发onChange事件时，因为状态机同步需要时间，所以若从状态机取值，
  // 会发生获取值有延迟情况，所以需要实时传值。而保留状态机的原因在于，实时传值并非两个值都会传递过来，当传递一个值时，
  // 为了避免之前的值丢失，还是需要从状态机获取当前的值。
  const triggerChange = (changedValue: CaptchaInputValue) => {
    if (props.onChange) {
      props.onChange({captchaKey, captchaCode, ...changedValue});
    }
  };

  /**
   * 获取验证码
   */
  const {run: getCaptcha} = useRequest(() => {
    return queryCaptcha();
  }, {
    manual: true,
    onSuccess: (data) => {
      setImageData(data.captchaImg);
      setCaptchaKey(data.captchaKey);
      triggerChange({captchaKey: data.captchaKey});
    }
  })

  // 更换验证码
  const onClickImage = () => {
    getCaptcha();
  };
  // 使用ref实现父组件调用子组件方法，实现验证码错误后主动触发刷新而不重新渲染子组件
  useImperativeHandle(ref, () => ({
    updateCaptcha: () => {
      onClickImage();
    }
  }));

  useEffect(() => {
    setImageData(loading);
    getCaptcha();
  }, []);


  // 输入框变化
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value || '';
    setCaptchaCode(code);
    triggerChange({captchaCode: code});
  }

  return (
    <div>
      <div className={styles.captchaContainer}>
        <Input prefix={<SafetyCertificateOutlined style={{color: '#319cff'}}/>} placeholder={intl.formatMessage({
          id: 'pages.login.vaCode.placeholder',
          defaultMessage: '请输入验证码',
        })}
               onChange={onChangeInput}
               style={{marginRight: 5, padding: '6.5px 11px 6.5px 11px', verticalAlign: 'middle'}}/>
        <img className={styles.codeImg}
             title={"点击更换验证码"}
             src={imageData} onClick={onClickImage}/>
      </div>
    </div>
  );
};
export default forwardRef(ImageCaptcha);
