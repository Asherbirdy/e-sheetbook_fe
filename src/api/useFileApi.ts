import { AxiosPromise } from 'axios'
import { useApiRequest } from './http'
import {
  CreateFilePayload, CreateFileResponse, DeleteFilePayload, DeleteFileResponse, EditFilePayload, EditFileResponse, GetFileResponse,
} from '@/types'
import { PrivateApiRoute } from '@/enums'

export const useFileApi = {
  get: (): AxiosPromise<GetFileResponse> => {
    return useApiRequest.get({ url: PrivateApiRoute.File })
  },
  create: (payload: CreateFilePayload): AxiosPromise<CreateFileResponse> => {
    return useApiRequest.post({
      url: PrivateApiRoute.File,
      data: payload,
    })
  },

  edit: (payload: EditFilePayload): AxiosPromise<EditFileResponse> => {
    return useApiRequest.put({
      url: PrivateApiRoute.File,
      data: payload,
    })
  },
  delete: (payload: DeleteFilePayload): AxiosPromise<DeleteFileResponse> => {
    return useApiRequest.delete({
      url: PrivateApiRoute.File,
      data: payload,
    })
  },
}