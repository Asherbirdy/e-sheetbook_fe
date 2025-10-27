import { useApiRequest } from '../http'

export const useFileApi = {
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