import {message, Modal} from "antd";

const {confirm} = Modal;

/** 选择项检查 */
const checkSelectRows = (selectedRowsState?: any[]) => {
  if (selectedRowsState) {
    const selectCount = selectedRowsState.length;
    if (selectCount === 0) {
      message.error('请选择要操作的行！');
      return false;
    }
  }
  return true;
}


type ConfirmParams = {
  selectedRows?: any[],
  needCheck?: boolean,
  needConfirm?: boolean,
  confirmTitle?: string,
  confirmContent?: string,
  onOk: any
}
/** 确认对话框再封装 */
export const Confirm = (confirmParams: ConfirmParams) => {
  const {selectedRows, needCheck, needConfirm, confirmTitle, confirmContent, onOk} = confirmParams;
  if (!needCheck || checkSelectRows(selectedRows)) {
    if (needConfirm ?? true) {
      confirm({
        title: confirmTitle ?? '提示',
        content: confirmContent ?? '确认吗？',
        onOk() {
          onOk();
        }
      });
    } else {
      onOk();
    }
  }
}
