import {Tree} from "antd";
import {getTree} from '@/services/api/system/menu';
import {forwardRef, Key, useImperativeHandle, useState} from "react";
import {useRequest} from 'umi';

// Tree并非标准Form组件，需要遵循antd的自定义组件与Form联合使用规则：
// 1、提供受控属性 value 或其它与 valuePropName 的值同名的属性；
// 2、提供 onChange 事件或 trigger 的值同名的事件。
interface PermissionTreeSelectProps {
  value?: Key[];
  onSelect?: (key: number) => void;
  onChange?: (value: Key[]) => void;
}

// 这个组件有点复杂，涉及大量计算，多写点备注
const PermissionTree = (props: PermissionTreeSelectProps, ref: any) => {

  const [initData, setInitData] = useState<any[]>([]);

  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);

  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);

  const [strictly, setStrictly] = useState<boolean>(false);

  const [keys, setKeys] = useState<number[]>([]);

  const [fatherViewData, setFatherViewData] = useState<Key[]>([]);

  // 递归循环
  // 1、返回一个含有所有key值的平面数组;
  // 2、填充一个携带有父级id的key-value结构的菜单;
  const fatherView: any = {};
  const loop = (fatherId: number, data: any[]) => {
    let keysArray: number[] = [];
    (data || []).forEach((item: any) => {
      keysArray.push(item.key);
      if (item.children.length > 0) {
        keysArray = keysArray.concat(loop(item.key, item.children));
      }
      fatherView[item.key] = fatherId;
    });
    return keysArray;
  }

  // 递归遍历找出指定id菜单的所有父级
  const loopForFindFatherIds = (id: Key) => {
    let fatherArray: Key[] = [];
    if (fatherViewData[id]) {
      fatherArray.push(fatherViewData[id]);
      fatherArray = fatherArray.concat(loopForFindFatherIds(fatherViewData[id]));
    }
    return fatherArray;
  }

  // 查询指定集合节点id的父级id并合并之（本函数已去重）
  const concatFatherIds = (idArray: Key[]) => {
    let unionArray: Key[] = [];
    idArray.forEach((id) => {
      unionArray.push(id);
      unionArray = unionArray.concat(loopForFindFatherIds(id));
    });
    // 去重
    return Array.from(new Set(unionArray));
  }

  // 判断节点集合中每个节点是否应该被选中，并收集所有符合条件者将其填充入一个key集合
  const resultArray: Key[] = [];
  const shouldChecked = (data: any[]): boolean => {
    return (data || []).every((item: any) => {
      let result: boolean = true;
      // 未在value中，直接排除掉
      if (props.value?.indexOf(item.key as number) === -1) {
        result = false;
      }
      // 叶子节点直接通过
      if (result && item.children.length === 0) {
        result = true;
      }
      // 非叶子节点查询子级是否应该被选中，此处需要递归查询
      else {
        return shouldChecked(item.children);
      }
      if (result) {
        resultArray.push(item.key);
      }
      return result;
    });
  }

  // 将并非所有子级都选中的选中状态的父节点筛掉后，将剩余数据填充入一个id数组并返回
  const filterValueData = (data: any[]) => {
    shouldChecked(data);
    return resultArray;
  }

  const keysBuild = (data: any[]) => {
    setKeys(loop(0, data));
    setFatherViewData(fatherView);
  }

  const onCheck = (checked: {
    checked: Key[];
    halfChecked: Key[];
  } | Key[]) => {
    let checkedArr: Key[] = [];
    if (checked instanceof Array)
      checkedArr = checked;
    else
      checkedArr = checked.checked;
    setCheckedKeys(checkedArr);
    if (props.onChange) {
      // 因为现在只有当子级全部都选中时才会进行父级选中（不全部选中是不选或半选），此时需要手动将父级id加入数组，因为有构建菜单需要。
      props.onChange(concatFatherIds(checkedArr));
    }
  }

  const onExpand = (expandedKeyArr: Key[], info: {
    node: any;
    expanded: boolean;
    nativeEvent: MouseEvent;
  }) => {
    if (info.expanded) {
      const key = expandedKeyArr[expandedKeyArr.length - 1];
      const index = expandedKeys.indexOf(key);
      if (index === -1) {
        setExpandedKeys(expandedKeys.concat(key));
      }
    } else {
      let tempArray: Key[] = [];
      info.node.children?.forEach((node: any) => {
        tempArray.push(node.key);
      });
      tempArray = expandedKeyArr.filter((key) => {
        return tempArray.indexOf(key) === -1;
      });
      setExpandedKeys(tempArray);
    }
  }

  const {data: treeData} = useRequest(getTree, {
    onSuccess: (data) => {
      keysBuild(data);
      if (props.value) {
        // 组件为受控模式，当未全部选择其子组件时父组件要设置为不选，否则因为父组件选中就导致将所有子级选中
        const resultData = filterValueData(data);
        setInitData(resultData);
        setCheckedKeys(resultData);
      }
    },
    cacheKey: 'menuTree',
    initialData: []
  });

  useImperativeHandle(ref, () => ({
    expandedAll: () => {
      setExpandedKeys(keys);
    },
    retractAll: () => {
      setExpandedKeys([]);
    },
    checkAll: () => {
      setCheckedKeys(keys);
    },
    deCheckAll: () => {
      setCheckedKeys([]);
    },
    restore: () => {
      if (props.value) {
        setCheckedKeys(initData);
      } else {
        setCheckedKeys([]);
      }
    },
    strictly: () => {
      setStrictly(false);
    },
    loosely: () => {
      setStrictly(true);
    }
  }));

  return (
    <Tree
      key="permission"
      autoExpandParent={true}
      checkable
      treeData={treeData}
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      checkStrictly={strictly}
    />
  );
};
export default forwardRef(PermissionTree);
