import {
  LoginPayload, LoginResponse, RegisterPayload, SendOTPtoEmailPayload,
} from '@/types'
import { useApiRequest } from './http'
import { AxiosPromise } from 'axios'
import { PrivateApiRoute, PublicApiRoute } from '@/enums'

interface CheckLoginResponse {
  status?: string;
  msg?: string;
}

export const useAuthApi = {
  /*
   * 登入
  */
  login: (payload: LoginPayload): AxiosPromise<LoginResponse> => {
    return useApiRequest.post({
      url: PublicApiRoute.AuthLogin,
      data: payload,
    })
  },
  sendOTPtoEmail: (payload: SendOTPtoEmailPayload) => {
    return useApiRequest.post({
      url: PrivateApiRoute.AuthSendOTP,
      data: payload,
    })
  },
  register: (payload: RegisterPayload) => {
    return useApiRequest.post({
      url: PrivateApiRoute.AuthRegister,
      data: payload,
    })
  },
  checkLogin: (): AxiosPromise<CheckLoginResponse> => {
    return useApiRequest.get({ url: PublicApiRoute.AuthCheckLogin })
  },
}
