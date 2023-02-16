import React, {useEffect, useState} from "react";
import {Form, Input, Modal, Tabs, Tooltip} from 'antd';
import {SettingOutlined} from "@ant-design/icons";
import styles from './index.less';
import classNames from "classnames";
import icons from './icons'

interface IconSelectProps {
  label?: string;
  tooltip?: string;
  hidden?: boolean;
  placeholder?: string;
  width?: number | "sm" | "md" | "xl" | "xs" | "lg" | undefined;
  name?: string;
  // 若要初始化图标选择器默认选中和输入框前缀图标，必须设置此值
  iconName?: string;
  onOk?: (icon: string) => void;
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
}

export const IconSelect: React.FC<IconSelectProps> = (props) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const [affirmedIcon, setAffirmedIcon] = useState<string>('');
  const [dataMap, setDataMap] = useState({});
  const {hidden, onOk, onCancel} = props;
  const {TabPane} = Tabs;

  const handleSearch = () => {
    setModalVisible(true);
  }
  const selectIcon = (icon: string) => {
    setSelectedIcon(icon);
  }

  useEffect(() => {
    // 遍历所有图标，将其转化为key-value结构
    const valueMap = {};
    icons.forEach((item) => {
      item.icons.forEach((icon) => {
        valueMap[icon.name] = icon.component;
      });
    });
    setDataMap(valueMap);
    if (props.iconName) {
      setAffirmedIcon(props.iconName);
      selectIcon(props.iconName);
    }
  }, []);

  const handleOk = () => {
    if (onOk)
      onOk(selectedIcon);
    setAffirmedIcon(selectedIcon);
    setModalVisible(false);
  }
  const handleCancel = () => {
    setModalVisible(false);
  }
  return (
    <div>
      <Form.Item key="icon" label={props.label ?? "图标选择"} name={props.name ?? "icon"} tooltip={props.tooltip}
                 hidden={hidden}>
        <Input.Search
          prefix={affirmedIcon === '' ? null : dataMap[affirmedIcon]}
          readOnly={true}
          enterButton={<SettingOutlined/>}
          onSearch={handleSearch}
          style={{width: 328}}
        >
        </Input.Search>
      </Form.Item>
      <Modal visible={modalVisible} centered onOk={handleOk} width={700} onCancel={onCancel ?? handleCancel}>
        <Tabs defaultActiveKey="1">
          {icons.map((item) => {
            return <TabPane tab={item.tab} key={item.key}>
              <div style={{height: '40vh', overflowY: 'auto'}}>
                {
                  item.icons.map((icon) => {
                    return (<Tooltip title={icon.name} key={icon.name}>
                      <div
                        className={classNames(styles.icon, {[styles.selectedIcon]: icon.name === selectedIcon})}
                        onClick={() => {
                          selectIcon(icon.name)
                        }}
                      >
                        {icon.component}
                      </div>
                    </Tooltip>);
                  })
                }
              </div>
            </TabPane>
          })}
        </Tabs>
      </Modal>
    </div>
  );
}
