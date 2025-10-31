import { AxiosPromise } from 'axios'
import { useApiRequest } from './http'
import {
  CreateSheetPayload, CreateSheetResponse, DeleteSheetPayload, DeleteSheetResponse, EditSheetPayload, EditSheetResponse, GetSheetFromFilePayload, GetSheetFromFileResponse,
  GetSheetResponse,
} from '@/types'

export const useSheetApi = {
  get: (): AxiosPromise<GetSheetResponse> =>{
    return useApiRequest.get({ url: '/sheet' })
  },
  getSheetFromFile: (payload: GetSheetFromFilePayload): AxiosPromise<GetSheetFromFileResponse> => {
    return useApiRequest.get({
      url: `/sheet/file?fileId=${payload.fileId}`,
      data: payload,
    })
  },
  create: (payload: CreateSheetPayload): AxiosPromise<CreateSheetResponse> => {
    return useApiRequest.post({
      url: '/sheet',
      data: payload,
    })
  },
  edit: (payload: EditSheetPayload): AxiosPromise<EditSheetResponse> => {
    return useApiRequest.put({
      url: '/sheet',
      data: payload,
    })
  },
  delete: (payload: DeleteSheetPayload): AxiosPromise<DeleteSheetResponse> => {
    return useApiRequest.delete({
      url: '/sheet',
      data: payload,
    })
  },
}