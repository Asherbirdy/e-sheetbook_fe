import { AxiosPromise } from 'axios'
import { useApiRequest } from './http'
import {
  CreateSheetPayload, CreateSheetResponse, DeleteSheetPayload, DeleteSheetResponse, EditSheetPayload, EditSheetResponse, GetSheetFromFilePayload, GetSheetFromFileResponse,
  GetSheetResponse,
} from '@/types'
import { PrivateApiRoute } from '@/enums'

export const useSheetApi = {
  get: (): AxiosPromise<GetSheetResponse> =>{
    return useApiRequest.get({ url: PrivateApiRoute.Sheet })
  },
  getSheetFromFile: (payload: GetSheetFromFilePayload): AxiosPromise<GetSheetFromFileResponse> => {
    return useApiRequest.get({
      url: `${PrivateApiRoute.SheetGetFromFile}?fileId=${payload.fileId}`,
      data: payload,
    })
  },
  create: (payload: CreateSheetPayload): AxiosPromise<CreateSheetResponse> => {
    return useApiRequest.post({
      url: PrivateApiRoute.Sheet,
      data: payload,
    })
  },
  edit: (payload: EditSheetPayload): AxiosPromise<EditSheetResponse> => {
    return useApiRequest.put({
      url: PrivateApiRoute.Sheet,
      data: payload,
    })
  },
  delete: (payload: DeleteSheetPayload): AxiosPromise<DeleteSheetResponse> => {
    return useApiRequest.delete({
      url: PrivateApiRoute.Sheet,
      data: payload,
    })
  },
}