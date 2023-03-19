import {useModel} from "@@/plugin-model/useModel";
import {Avatar} from "antd";
import {UserOutlined} from "@ant-design/icons";
import styles from './index.less';
import React from "react";
import { AvatarSize } from "antd/lib/avatar/SizeContext";

const HeadPhoto: React.FC<{ className?: string, size?: AvatarSize, style?: React.CSSProperties, currentUser?: boolean, src?: string }> = (props) => {
  const {initialState} = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  if (props.currentUser) {
    return (
      <>
        {
          currentUser?.avatar ?
            <Avatar size={props.size ?? 64} className={`${styles.headPhoto} ${props.className}`}
                    src={currentUser?.avatar} alt="avatar" style={props.style}></Avatar> :
            <Avatar size={props.size ?? 64} className={`${styles.headPhoto} ${props.className}`} icon={<UserOutlined/>}
                    alt="avatar" style={props.style}/>
        }
      </>
    );
  }
  return (
    <>
      {
        props.src ?
          <Avatar size={props.size ?? 64} className={`${styles.headPhoto} ${props.className}`}
                  src={props.src} alt="avatar" style={props.style}></Avatar> :
          <Avatar size={props.size ?? 64} className={`${styles.headPhoto} ${props.className}`} icon={<UserOutlined/>}
                  alt="avatar" style={props.style}/>
      }
    </>
  );
}
export default HeadPhoto;
