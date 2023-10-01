export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
    ],
  },
  {
    name: '工作台',
    icon: 'DesktopOutlined',
    path: '/workspace',
    component: './workplace/Index',
  },
  {
    name: '个人页',
    icon: 'user',
    path: '/account',
    hideInMenu: true,
    routes: [
      {
        path: '/account',
        redirect: '/account/center',
      },
      {
        name: '个人中心',
        icon: 'smile',
        path: '/account/center',
        component: './account/center',
      },
      {
        name: '个人设置',
        icon: 'smile',
        path: '/account/settings',
        component: './account/settings',
      },
    ],
  },
  {
    name: '系统管理',
    icon: 'SettingOutlined',
    access: 'system',
    path: '/system',
    routes: [
      {
        name: '用户管理',
        path: 'user',
        component: './system/UserManage/UserList',
        access: 'user',
      },
      {
        name: '角色管理',
        path: 'role',
        component: './system/RoleManage/RoleList',
        access: 'role',
      },
      {
        name: '菜单管理',
        path: 'menu',
        component: './system/MenuManage/MenuList',
        access: 'menu',
      },
    ]
  },
  {
    name: '消息管理',
    icon: 'MailOutlined',
    access: 'msg',
    path: '/msg',
    routes: [
      {
        name: '公告管理',
        path: 'bulletin',
        component: './message/BulletinManage/BulletinList',
        access: 'bulletin',
      },
    ]
  },
  {
    name: '系统监控',
    icon: 'DashboardOutlined',
    access: 'monitor',
    path: '/monitor',
    routes: [
      {
        name: '服务监控',
        path: 'server',
        component: './monitor/Server',
        access: 'server',
      },
      {
        name: '数据库监控',
        path: 'database',
        component: './monitor/Database',
        access: 'database',
      },
      {
        name: 'Redis监控',
        path: 'redis',
        component: './monitor/Redis',
        access: 'redis',
      },
    ]
  },
  {
    name: '系统日志',
    icon: 'BookOutlined',
    access: 'log',
    path: '/log',
    routes: [
      {
        name: '操作日志',
        path: 'businessLog',
        component: './log/BusinessLog',
        access: 'businessLog',
      },
    ]
  },
  {
    name: '消息中心',
    path: '/notice',
    component: './notice/index',
    hideInMenu: true
  },
  {
    name: '邮箱绑定',
    layout: false,
    path: '/bindEmailResult',
    component: './bindemail/Result',
    hideInMenu: true,
  },
  {
    name: '找回密码',
    layout: false,
    path: '/findPassword',
    component: './user/FindPassword',
    hideInMenu: true,
  },
  {
    path: '/',
    redirect: '/workspace',
  },
  {
    component: './404',
  },
];
