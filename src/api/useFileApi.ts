import { AxiosPromise } from 'axios'
import { useApiRequest } from './http'
import {
  CreateFilePayload, CreateFileResponse, DeleteFilePayload, DeleteFileResponse, EditFilePayload, EditFileResponse, GetFileResponse,
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

  edit: (payload: EditFilePayload): AxiosPromise<EditFileResponse> => {
    return useApiRequest.put({
      url: '/file',
      data: payload,
    })
  },
  delete: (payload: DeleteFilePayload): AxiosPromise<DeleteFileResponse> => {
    return useApiRequest.post({
      url: '/file',
      data: payload,
    })
  },
}