import {TreeSelect} from "antd";
import {getTreeSelector} from '@/services/api/system/menu';
import {forwardRef, useImperativeHandle, useState} from "react";
import {useRequest} from 'umi';

interface PermissionTreeSelectProps {
  placeholder: string;
  disabled?: boolean;
  onSelect?: (key: number) => void;
  value?: number;
  onChange?: (key: number) => void;
}

const PermissionTreeSelect = (props: PermissionTreeSelectProps, ref: any) => {

  const [treeData, setTreeData] = useState<any[]>([]);

  const [dataMap, setDataMap] = useState({});

  const valueMap = {};

  // 深度遍历数据，将其转化为平面的key-value结构
  const loops = (data: API.TreeSelect[]) => {
    (data || []).forEach((obj: API.TreeSelect) => {
      valueMap[obj.value] = obj;
      if (obj.children.length > 0) {
        loops(obj.children);
      }
    });
  }

  const valueMapBuild = (data: API.TreeSelect[]) => {
    loops(data);
  }

  useRequest(getTreeSelector, {
    onSuccess: (data) => {
      valueMapBuild(data);
      setDataMap(valueMap);
      setTreeData(data);
    }
  })

  useImperativeHandle(ref, () => ({
    // 自定义函数实现返回当前选择的原始数据行(配合onSelect回调使用，将其key传递进来)
    getSelected: (key: number) => {
      return dataMap[key ?? 0];
    }
  }));

  return (
    <TreeSelect
      style={{width: '328px'}}
      treeData={treeData}
      allowClear={true}
      placeholder={props.placeholder}
      disabled={props.disabled}
      value={props.value}
      onSelect={(value: number) => {
        if (props.onChange)
          props.onChange(value);
        if (props.onSelect)
          props.onSelect(value);
      }}
    />
  );
};

export default forwardRef(PermissionTreeSelect);
