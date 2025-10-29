import { AxiosPromise } from 'axios'
import { useApiRequest } from '../http'
import {
  CreateFilePayload, CreateFileResponse, GetFileResponse,
} from '@/types'

export const useFileApi = {
  get: (): AxiosPromise<GetFileResponse> => {
    return useApiRequest.get({ url: '/file' })
  },
  create: (payload: CreateFilePayload): AxiosPromise<CreateFileResponse> => {
    return useApiRequest.post({
      url: '/file',
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