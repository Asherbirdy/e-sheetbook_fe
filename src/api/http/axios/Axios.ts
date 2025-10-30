/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type {
  AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig,
} from 'axios'

import AbortAxios from './AbortAxios'
import type { AxiosOptions, RequstInterceptors } from './type'

import { CookieEnum } from '@/enums'
import { cookie } from '@/utils'
import { config } from '@/config'

class Axios {
  private axiosInstance: AxiosInstance
  private options: AxiosOptions
  private interceptors: RequstInterceptors | undefined

  constructor (options: AxiosOptions) {
    this.axiosInstance = axios.create(options)
    this.options = options
    this.interceptors = options.interceptors
    this.setInterceptors() // 對攔截器進行初始註冊
  }

  private async refreshTokenIfNeeded (): Promise<boolean> {
    const token = cookie.get(CookieEnum.AccessToken)

    // 如果已有 accessToken,則無需刷新
    if (token) {
      return true
    }

    // 檢查是否有 refreshToken
    const refreshToken = cookie.get(CookieEnum.RefreshToken)

    // if (!refreshToken) {
    //   // 如果沒有 refreshToken,則直接導航到登入頁面
    //   if (
    //     window.location.pathname !== import.meta.env.VITE_BASE &&
    //     window.location.pathname !== `${import.meta.env.VITE_BASE}forgetPassword` &&
    //     window.location.pathname !== `${import.meta.env.VITE_BASE}teenMeetingAttend`
    //   ) {
    //     // 導航到登入頁面
    //     window.location.href = import.meta.env.VITE_BASE
    //   }
    //   return false
    // }

    try {
      // 嘗試刷新 accessToken
      const response = await axios.get(
        `${config.apiUrl}/auth/refreshToken`,
        { headers: { Authorization: `Bearer ${refreshToken}` } },
      )

      const newAccessToken = response.data.jwtAccessToken.accessTokenJWT
      cookie.set(CookieEnum.AccessToken, newAccessToken)
      return true // 刷新成功
    } catch (error) {
      console.error('Error refreshing token:', error)
      cookie.remove(CookieEnum.RefreshToken)
      cookie.remove(CookieEnum.AccessToken)
      return false // 刷新失敗
    }
  }

  // 註冊攔截器方法
  setInterceptors () {
    if (!this.interceptors) return // 如果配置中並沒有傳入攔截器,直接返回

    // 解構出各種攔截器
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptor,
      responseInterceptorsCatch,
    } = this.interceptors

    const abortAxios = new AbortAxios()

    // 掛載請求攔截器
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const abortRepetitiveRequest =
          (config as unknown as any)?.abortRepetitiveRequest

        let token = cookie.get(CookieEnum.AccessToken)

        // 如果沒有 accessToken
        if (!token) {
          // 嘗試刷新 token
          const refreshed = await this.refreshTokenIfNeeded()
          if (!refreshed) {
            // 如果刷新失敗,直接返回config
            return config
          }
          token = cookie.get(CookieEnum.AccessToken)
        }

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // 儲存請求標示和其他操作...
        if (abortRepetitiveRequest) {
          abortAxios.addPending(config)
        }

        // 如果存在請求攔截器,則將 config 先交給 requestInterceptors 做對應的配置
        if (requestInterceptors) {
          config = requestInterceptors(config)
        }

        return config
      },
      requestInterceptorsCatch ?? undefined,
    )

    // 掛載響應攔截器
    this.axiosInstance.interceptors.response.use(
      (res: AxiosResponse) => {
        // 取消請求
        res && abortAxios.removePending(res.config)

        // 如果存在請求攔截器,則將 config 先交給 requestInterceptors 做對應的配置
        if (responseInterceptor) {
          res = responseInterceptor(res)
        }

        // 根據 options.directlyGetData 配置選項判斷使否直接取得data值
        if (this.options.directlyGetData) {
          res = res.data
        }

        return res
      },
      (err: AxiosError) => {
        // 如果存在請求攔截器,則將 config 先交給 requestInterceptors 做對應的配置
        if (responseInterceptorsCatch) {
          return responseInterceptorsCatch(this.axiosInstance, err)
        }
        return err
      },
    )
  }

  // 統一請求方法
  request<T = any> (config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Response>>(config)
        .then((res) => {
          return resolve(res as unknown as Promise<T>)
        })
        .catch((err) => {
          return reject(err)
        })
    })
  }

  get<T = any> (config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({
      ...config,
      method: 'GET',
    })
  }
  post<T = any> (config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({
      ...config,
      method: 'POST',
    })
  }
  put<T = any> (config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({
      ...config,
      method: 'PUT',
    })
  }
  patch<T = any> (config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({
      ...config,
      method: 'PATCH',
    })
  }
  delete<T = any> (config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({
      ...config,
      method: 'DELETE',
    })
  }
}

export default Axios