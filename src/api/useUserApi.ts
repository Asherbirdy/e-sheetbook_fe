import { AxiosPromise } from 'axios'
import { useApiRequest } from './http'
import { ShowCurrentResponse } from '@/types'
import { PrivateApiRoute } from '@/enums'

export const useUserApi = {
  showCurrent: (): AxiosPromise<ShowCurrentResponse> => {
    return useApiRequest.get({ url: PrivateApiRoute.UserShowMe })
  },
}