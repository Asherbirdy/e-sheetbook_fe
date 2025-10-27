// requestInterceptors.ts
import type { AxiosError } from 'axios'
import axios from 'axios'

import { retry } from './axiosRetry'
import { handleErrorStatus } from './handleErrorStatus'
import { RequstInterceptors } from './type'

// ** 繼承了我們在最開始實現的抽象類RequestInterceptors，主要關心responseInterceptorsCatch內容
const _RequstInterceptors: RequstInterceptors = {
  requestInterceptors (config) {

    return config
  },
  requestInterceptorsCatch (err) { return err },
  responseInterceptor (config) { return config },
  responseInterceptorsCatch (axiosInstance, err: AxiosError) {
    const message = err.code === 'ECONNABORTED' ? '[ Timeout! ] 請求超過指定時間!' : undefined

    // 判斷本次請求是否已經被取消
    if (axios.isCancel(err)) {
      return Promise.reject(err)
    }
    console.log(err)

    // 檢查各種 http status
    handleErrorStatus((err as AxiosError).response?.status, message, (message) => console.error(message))

    // 響應錯誤 實現 重連功能
    return retry(axiosInstance, err as AxiosError)
  },
}

export default _RequstInterceptors
