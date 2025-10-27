import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'

import AbortAxios from './AbortAxios'
import type { AxiosOptions, RequstInterceptors, Respones } from './type'

// ** 創建一個 class, 後續可以通過 const useRequest = new Axios(...) 直接使用
class Axios {
  private axiosInstance: AxiosInstance
  private options: AxiosOptions
  private interceptors: RequstInterceptors | undefined
  constructor (options: AxiosOptions) {
    console.log()
    const option_withCredentials = {
      ...options,
      withCredentials: true
    }
    this.axiosInstance = axios.create(option_withCredentials)
    this.options = option_withCredentials
    console.log(this.options)
    this.interceptors = options.interceptors
    this.setInterceptors() // 對攔截器進行初始註冊
  }

  // 註冊攔截器方法
  setInterceptors () {
    if (!this.interceptors) return // 如果配置中並沒有傳入攔截器，直接返回

    // 解構出各種攔截器
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptor,
      responseInterceptorsCatch
    } = this.interceptors

    const abortAxios = new AbortAxios()

    // 掛載請求攔截器
    this.axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      // 是否清除重複請求
      const abortRepetitiveRequest = (config as unknown as any)?.abortRepetitiveRequest ?? this.options.abortRepetitiveRequest

      // 儲存請求標示
      if (abortRepetitiveRequest) {
        abortAxios.addPending(config)
      }

      // 如果存在請求攔截器，則將 config 先交給 requestInterceptors 做對應的配置
      if (requestInterceptors) {
        config = requestInterceptors(config)
      }

      return config
    }, requestInterceptorsCatch ?? undefined)

    // 掛載響應攔截器
    this.axiosInstance.interceptors.response.use((res: AxiosResponse) => {
      // 取消請求
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      res && abortAxios.removePending(res.config)

      // 如果存在請求攔截器，則將 config 先交給 requestInterceptors 做對應的配置
      if (responseInterceptor) {
        res = responseInterceptor(res)
      }

      // 根據 options.directlyGetData 配置選項判斷使否直接取得data值
      if (this.options.directlyGetData) {
        res = res.data
      }

      return res
    }, (err: AxiosError) => {
       // 如果存在請求攔截器，則將 config 先交給 requestInterceptors 做對應的配置
      if (responseInterceptorsCatch) {
        return responseInterceptorsCatch(this.axiosInstance, err)
      }
      return err
    })
  }

  // 統一請求方法
  request<T = any> (config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      this.axiosInstance.request<any, AxiosResponse<Respones>>(config).then((res) => {
        return resolve(res as unknown as Promise<T>)
      }).catch((err) => {
        return reject(err)
      })
    })
  }

  get<T = any> (config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' })
  }
  post<T = any> (config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' })
  }
  put<T = any> (config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT' })
  }
  delete<T = any> (config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' })
  }
}

export default Axios