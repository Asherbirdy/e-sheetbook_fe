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
  /*
   * 登入驗證
  */
  loginValidate: (): Promise<any> => {
    return useApiRequest.get({ url: '/member/loginedCustomerInfo' })
  },
}