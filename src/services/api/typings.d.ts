// @ts-ignore
/* eslint-disable */

declare namespace API {
  // type ResponseData = {
  //   code: number;
  //   remark: string;
  //   result: any;
  // };

  type UserInfo = {
    userId?: number;
    username?: string;
    nickName?: string;
    avatar?: string;
    email?: string,
    profile?: string,
    country?: string,
    provinceCode: number,
    province?: string,
    cityCode: number,
    city?: string,
    address?: string,
    phone?: string,
  }

  type CurrentUser = {
    userId?: number;
    username?: string;
    nickName?: string;
    avatar?: string;
    unreadCount?: number;
    roles: string[];
    menus: any[];
    authorities: string[];
  };

  // 登录结果(type:登录方式 success:是否成功 errorMessage:错误信息)，其中后两项由后端返回
  type LoginResult = {
    type?: string;
    success: boolean;
    errorMessage: string;
  };

  type UserListItem = {
    id: number;
    username: string;
    enabled: boolean;
  };

  type RoleListItem = {
    id: number;
    roleCode: string;
    roleName: string;
    remark: string;
    createBy: string;
    createTime: string;
  };

  type MenuListItem = {
    id: number;
    menuName: string;
    frame: boolean;
    path: string;
    redirect: string;
    pid: number;
    type: number;
    visible: boolean;
    permission: string;
    cache: boolean;
    icon: string;
    sort: number;
    childMaxSort: number;
    createBy: number;
    remark: string;
    createTime: string
  };

  type TreeSelect = {
    key: number;
    value: any;
    childMaxSort: number;
    children: TreeSelect[];
  };

  type PageResponse<T> = {
    total?: number;
    current?: number;
    pageSize?: number;
    data?: T[]
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type BusinessLogItem = {
    id: number;
    title: string;
    requestUrl: string;
    requestMethod: string;
    requestParams: string;
    status: boolean;
    requestTime: string;
    response: string;
    responseTime: string;
    targetClassName: string;
    targetMethodName: string;
    exception: string;
    operationUser: string;
    operationIp: string;
    createTime: string;
    updateTime: string;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };
  type MonitorServerInfo = {
    sys: {
      computerName: string;
      computerIp: string;
      osName: string;
      osArch: string;
    },
    cpu: {
      cpuNum: number,
      total: number,
      sys: number,
      used: number,
      free: number
    },
    mem: {
      total: number,
      used: number,
      free: number
    },
    jvm: {
      name: string,
      version: string,
      startTime: string,
      runTime: string,
    },
    sysFiles: {
      dirName: string,
      sysTypeName: string,
      typeName: string,
      total: string,
      free: string
    }[]
  }

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type BulletinListItem = {
    id: number;
    title: string;
    content: string;
    createBy: string,
    createTime: string
  };


  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    autoLogin?: boolean;
    type?: string;
    username?: string;
    password?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeItem = RemindItem | MessageItem | BulletinItem;

  type RemindItem = {
    key: number;
    id: number;
    targetType: string;
    title: string;
    content: string;
    read: boolean;
    sendTime: string;
    extra: any;
  };

  type MessageItem = {
    key: number;
    id: number;
    senderId: number;
    senderAvatar: string;
    senderName: string;
    content: string;
    read: boolean;
    sendTime: string;
    extra: any;
  };

  type BulletinItem = {
    key: number;
    id: number;
    title: string;
    content: string;
    read: boolean;
    sendTime: string;
  }
}
