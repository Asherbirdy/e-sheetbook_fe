import type { AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse, AxiosInstance, AxiosError } from 'axios'

// ** axios 實例配置，繼承 AxiosRequestConfig
export interface AxiosOptions extends AxiosRequestConfig {
  directlyGetData?: boolean // 是否直接返回 data 數據
  interceptors?: RequstInterceptors // 定義攔截器
  abortRepetitiveRequest?: boolean // 是否取消重複請求
  retryConfig?: {
    count: number // 重連次數
    waitTime: number // 每次請求間隔時間
  }
}

// ** 定義攔截器，後續在 index.ts 中繼承實現
export abstract class RequstInterceptors {
  abstract requestInterceptors?: (config: InternalAxiosRequestConfig)=> InternalAxiosRequestConfig
  abstract requestInterceptorsCatch: (err: Error)=> Error
  abstract responseInterceptor?: (res: AxiosResponse)=> AxiosResponse
  abstract responseInterceptorsCatch?: (axiosInstance: AxiosInstance, error: AxiosError)=> void;
}

// ** 定義返回類型
export interface Respones<T = any> {
  success: boolean;
  result: T
}