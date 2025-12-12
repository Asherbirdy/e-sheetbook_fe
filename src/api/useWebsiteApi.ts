import { AxiosPromise } from 'axios'
import { useApiRequest } from './http'
import { PrivateApiRoute } from '@/enums'
import {
  CreateWebsitePayload, CreateWebsiteData, GetAllWebsiteResponse, DeleteWebsitePayload, DeleteWebsiteResponse,
  EditWebsiteSheetPayload,
  EditWebsiteSheetResponse,
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
  deleteWebsite: (payload: DeleteWebsitePayload): AxiosPromise<DeleteWebsiteResponse> => {
    return useApiRequest.delete({
      url: PrivateApiRoute.WebsiteDelete,
      data: payload,
    })
  },
  // editWebsiteSheet
  editWebsiteSheet: (payload: EditWebsiteSheetPayload): AxiosPromise<EditWebsiteSheetResponse> => {
    return useApiRequest.put({
      url: PrivateApiRoute.WebsiteEditSheet,
      data: payload,
    })
  },
  // editWebsiteDetail
  editWebsiteDetail: (): AxiosPromise<any> => {
    return useApiRequest.put({ url: PrivateApiRoute.WebsiteEditDetail })
  },
}