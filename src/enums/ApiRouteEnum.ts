
export enum PrivateApiRoute {
  // ** Auth API 路由
  AuthLogin = '/auth/login',
  AuthSendOTP = '/auth/sendOTP',
  AuthRegister = '/auth/userRegister',

  // ** User API 路由
  UserShowMe = '/users/showMe',

  // ** File API 路由
  File = '/file',

  // ** Sheet API 路由
  Sheet = '/sheet',
  SheetGetFromFile = '/sheet/file',
}