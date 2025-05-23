import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RequestConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { user as queryCurrentUser } from './services/api/login';
import { DesktopOutlined } from '@ant-design/icons';
import icons from '@/components/IconSelect/icons'
import storage from "@/utils/storage";

const loginPath = '/user/login';
const bindEmailPath = '/bindEmailResult'
const findPasswordPath = '/findPassword'
const notRequiredPath = [loginPath, bindEmailPath, findPasswordPath]

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const { data } = await queryCurrentUser();
      return data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

/**
 * 异常处理程序
 200: '服务器成功返回请求的数据。',
 201: '新建或修改数据成功。',
 202: '一个请求已经进入后台排队（异步任务）。',
 204: '删除数据成功。',
 400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
 401: '用户没有权限（令牌、用户名、密码错误）。',
 403: '用户得到授权，但是访问是被禁止的。',
 404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
 405: '请求方法不被允许。',
 406: '请求的格式不可得。',
 410: '请求的资源被永久删除，且不会再得到的。',
 422: '当创建一个对象时，发生一个验证错误。',
 500: '服务器发生错误，请检查服务器。',
 502: '网关错误。',
 503: '服务不可用，服务器暂时过载或维护。',
 504: '网关超时。',
 //-----English
 200: The server successfully returned the requested data. ',
 201: New or modified data is successful. ',
 202: A request has entered the background queue (asynchronous task). ',
 204: Data deleted successfully. ',
 400: 'There was an error in the request sent, and the server did not create or modify data. ',
 401: The user does not have permission (token, username, password error). ',
 403: The user is authorized, but access is forbidden. ',
 404: The request sent was for a record that did not exist. ',
 405: The request method is not allowed. ',
 406: The requested format is not available. ',
 410':
 'The requested resource is permanently deleted and will no longer be available. ',
 422: When creating an object, a validation error occurred. ',
 500: An error occurred on the server, please check the server. ',
 502: Gateway error. ',
 503: The service is unavailable. ',
 504: The gateway timed out. ',
 * @see https://beta-pro.ant.design/docs/request-cn
 */
export const request: RequestConfig = {
  prefix: '/api',
  // errorHandler: (error: any) => {
  //   const {response} = error;
  //   console.log(error);
  //   if (!response) {
  //     notification.error({
  //       description: '服务异常，请联系管理员',
  //       message: '服务异常',
  //     });
  //   }
  //   throw error;
  // },
  requestInterceptors: [(url: string, options: any) => {
    let authorization = true;
    if (options.authorization != null && !options.authorization)
      authorization = false;
    if (authorization) {
      const c_token = storage.getToken();
      if (c_token) {
        let headers;
        if (options.isUpload) {
          headers = {
            'Authorization': c_token
          };
        } else {
          headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': c_token
          };
        }
        return (
          {
            url,
            options: { ...options, headers },
          }
        );
      }
    }
    return (
      {
        url,
        options,
      }
    );
  }],

};

// 无需权限就能访问的路由菜单
const defaultRouters = [
  {
    name: '工作台',
    icon: <DesktopOutlined />,
    path: '/workspace',
    component: './workplace/index',
  },
  {
    name: '消息中心',
    path: '/notice',
    component: './notice/index',
    hideInMenu: true
  },
  {
    name: '邮箱绑定',
    path: '/bindEmailResult',
    component: './bindemail/Result',
    layout: false,
    hideInMenu: true,
  },
  {
    name: '找回密码',
    path: '/findPassword',
    component: './user/FindPassword',
    layout: false,
    hideInMenu: true,
  },
];

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: ({ initialState }: { initialState: any }) => { rightContentRender: () => JSX.Element; disableContentMargin: boolean; footerRender: () => JSX.Element; onPageChange: () => void; links: JSX.Element[]; menuDataRender: undefined | (() => { path: any; children: any; name: any; icon: any }[] | undefined) } = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    // waterMarkProps: {
    //   content: initialState?.currentUser?.name,
    // },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && notRequiredPath.indexOf(location.pathname) === -1) {
        history.push(loginPath);
      }
    },
    links: [],
    // eslint-disable-next-line no-nested-ternary
    menuDataRender: initialState?.currentUser ? (initialState.currentUser.roles.indexOf('admin') !== -1 ? undefined : () => {
      const iconMap = {};
      icons.forEach((item) => {
        item.icons.forEach((icon) => {
          iconMap[icon.name] = icon.component;
        });
      });
      return defaultRouters.concat(initialState?.currentUser?.menus.map((item: { name: any; path: any; icon: string | number; children: any; }) => {
        return {
          name: item.name,
          path: item.path,
          icon: iconMap[item.icon],
          children: item.children,
        }
      }));
    }) : null,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};
