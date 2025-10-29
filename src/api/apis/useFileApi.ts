import { AxiosPromise } from 'axios'
import { useApiRequest } from '../http'
import { GetFileResponse } from '@/types'

export const useFileApi = {
  get: (): AxiosPromise<GetFileResponse> => {
    return useApiRequest.get({ url: '/file' })
  },
  create: (payload: any): Promise<any> => {
    return useApiRequest.post({
      url: '/tw/member/doLogin',
      data: payload,
    })
  },

  edit: (payload: any): Promise<any> => {
    return useApiRequest.post({
      url: '/tw/member/doLogin',
      data: payload,
    })
  },
  delete: (payload: any): Promise<any> => {
    return useApiRequest.post({
      url: '/tw/member/doLogin',
      data: payload,
    })
  },
}