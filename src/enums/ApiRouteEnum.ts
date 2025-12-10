
export enum PublicApiRoute {
  AuthLogin = '/auth/login',
  AuthLogout = '/auth/logout',
  AuthCheckLogin = '/auth/checkValidToken',
}

export enum PrivateApiRoute {
  // ** Auth API 路由
  AuthSendOTP = '/auth/sendOTP',
  AuthRegister = '/auth/userRegister',

  // ** User API 路由
  UserShowMe = '/users/showMe',

  // ** File API 路由
  File = '/file',

  // ** Sheet API 路由
  Sheet = '/sheet',
  SheetGetFromFile = '/sheet/file',

  // ** Website API 路由
  WebsiteCreate = '/website/create',
  WebsiteGetAll = '/website/all',
  WebsiteDelete = '/website/delete',
  WebsiteEditSheet = '/website/edit-sheet',
  WebsiteEditDetail = '/website/edit-detail',
}
