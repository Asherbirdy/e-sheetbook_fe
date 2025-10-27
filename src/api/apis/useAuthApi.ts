import { useApiRequest } from '../http'

export const useAuthApi = {
  /*
   * 登入
  */
  login: (payload: any): Promise<any> => {
    return useApiRequest.post({
      url: '/tw/member/doLogin',
      data: payload,
    })
  },
  register: (payload: any): Promise<any> => {
    return useApiRequest.post({
      url: '/tw/member/doLogin',
      data: payload,
    })
  },
  logout: (payload: any): Promise<any> => {
    return useApiRequest.post({
      url: '/tw/member/doLogin',
      data: payload,
    })
  },
  refreshToken: (payload: any): Promise<any> => {
    return useApiRequest.post({
      url: '/tw/member/doLogin',
      data: payload,
    })
  },
  checkValidToken: (payload: any): Promise<any> => {
    return useApiRequest.post({
      url: '/tw/member/doLogin',
      data: payload,
    })
  },
  sendOTPtoEmail: (payload: any): Promise<any> => {
    return useApiRequest.post({
      url: '/tw/member/doLogin',
      data: payload,
    })
  },
  bindOTPtoEmail: (payload: any): Promise<any> => {
    return useApiRequest.post({
      url: '/tw/member/doLogin',
      data: payload,
    })
  },
  forgetPaswordSendOTPtoEmail: (payload: any): Promise<any> => {
    return useApiRequest.post({
      url: '/tw/member/doLogin',
      data: payload,
    })
  },
  changePasswordWithOTP: (payload: any): Promise<any> => {
    return useApiRequest.post({
      url: '/tw/member/doLogin',
      data: payload,
    })
  },
}