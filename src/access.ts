/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const {currentUser} = initialState || {};
  const hasAuthority = (authority: string): boolean => {
    if (currentUser) {
      if (currentUser.roles.indexOf('admin') !== -1) {
        return true;
      }
      return currentUser.authorities.indexOf(authority) !== -1;
    }
    return false;
  }
  return {
    system: hasAuthority('sys'),
    user: hasAuthority('sys:user'),
    userAdd: hasAuthority('sys:user:add'),
    userEdit: hasAuthority('sys:user:edit'),
    userDelete: hasAuthority('sys:user:delete'),
    roleSetting: hasAuthority('sys:user:roleSetting'),
    userEnable: hasAuthority('sys:user:enable'),
    userDisable: hasAuthority('sys:user:disable'),
    role: hasAuthority('sys:role'),
    roleAdd: hasAuthority('sys:role:add'),
    roleEdit: hasAuthority('sys:role:edit'),
    roleDelete: hasAuthority('sys:role:delete'),
    roleAuthorize: hasAuthority('sys:role:roleAuthorize'),
    menu: hasAuthority('sys:menu'),
    menuAdd: hasAuthority('sys:menu:add'),
    menuEdit: hasAuthority('sys:menu:edit'),
    menuDelete: hasAuthority('sys:menu:delete'),
    log: hasAuthority('log'),
    businessLog: hasAuthority('log:businessLog'),
    businessLogDelete: hasAuthority('log:businessLog:delete'),
    monitor: hasAuthority('monitor'),
    service: hasAuthority('monitor:server'),
    database: hasAuthority('monitor:database'),
    redis: hasAuthority('monitor:redis'),
  };
}

