import { AxiosPromise } from 'axios'
import { useApiRequest } from '../http'
import { ShowCurrentResponse } from '@/types'

export const useUserApi = {
  showCurrent: (): AxiosPromise<ShowCurrentResponse> => {
    return useApiRequest.get({ url: '/tw/member/doLogin' })
  },
}