import {
  LoginPayload, LoginResponse, RegisterPayload, SendOTPtoEmailPayload,
} from '@/types'
import { useApiRequest } from './http'
import { AxiosPromise } from 'axios'

export const useAuthApi = {
  /*
   * 登入
  */
  login: (payload: LoginPayload): AxiosPromise<LoginResponse> => {
    return useApiRequest.post({
      url: '/auth/login',
      data: payload,
    })
  },
  sendOTPtoEmail: (payload: SendOTPtoEmailPayload) => {
    return useApiRequest.post({
      url: '/auth/sendOTP',
      data: payload,
    })
  },
  register: (payload: RegisterPayload) => {
    return useApiRequest.post({
      url: '/auth/userRegister',
      data: payload,
    })
  },
}
