import type {
  AxiosError, AxiosInstance,
} from 'axios'

export function retry (instance: AxiosInstance, err: AxiosError) {
  const config: any = err.config
  // 獲取配置內容(請求間隔時間、請求次數)
  const {
    waitTime, count,
  } = config.retryConfig ?? {}

  // 當前重複請求的次數
  config.currentCount = config.currentCount ?? 0

  if (config.currentCount > 0){
    console.log(`第${config.currentCount}次重新連線！`)
  }

  // 當前的重複請求次數已經大於設定的次數，返回Promise
  if (config.currentCount >= count) {
    return Promise.reject(err)
  }
  config.currentCount++

  // 等待間隔時間結束後再執行請求
  return wait(waitTime).then(() => instance(config))
}

// 等待請求的時間
const wait = (waitTime: number) => {
  return new Promise(resolve => setTimeout(resolve, waitTime))
}