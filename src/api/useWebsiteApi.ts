import { AxiosPromise } from 'axios'
import { useApiRequest } from './http'
import { PrivateApiRoute } from '@/enums'
import {
  CreateWebsitePayload, CreateWebsiteData, GetAllWebsiteResponse,
} from '@/types'

export const useWebsiteApi = {
  // Create
  create: (payload: CreateWebsitePayload): AxiosPromise<CreateWebsiteData> => {
    return useApiRequest.post({
      url: PrivateApiRoute.WebsiteCreate,
      data: payload,
    })
  },
  // Get All
  getAll: (): AxiosPromise<GetAllWebsiteResponse> => {
    return useApiRequest.get({ url: PrivateApiRoute.WebsiteGetAll })
  },
  // DeleteWebsite
  deleteWebsite: (): AxiosPromise<any> => {
    return useApiRequest.delete({ url: PrivateApiRoute.WebsiteDelete })
  },
  // editWebsiteSheet
  editWebsiteSheet: (): AxiosPromise<any> => {
    return useApiRequest.put({ url: PrivateApiRoute.WebsiteEditSheet })
  },
  // editWebsiteDetail
  editWebsiteDetail: (): AxiosPromise<any> => {
    return useApiRequest.put({ url: PrivateApiRoute.WebsiteEditDetail })
  },
}