import { useApiRequest } from '../http'

export const useUserApi = {
  /*
   * 登入
  */
  sample: (payload: any): Promise<any> => {
    return useApiRequest.post({
      url: '/tw/member/doLogin',
      data: payload,
    })
  },
}