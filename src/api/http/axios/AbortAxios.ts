import type { AxiosRequestConfig } from 'axios'

// ** 用於儲存控制器
const pendingMap = new Map<string, AbortController>()

// ** 創建為一值，返回類似：'/api:get',後續作為pendingMap的key
const getUrl = (config: AxiosRequestConfig) => {
  return [config.url, config.method].join(':')
}

class AbortAxios {
  // 填加控制器
  addPending (config: AxiosRequestConfig) {
    this.removePending(config)
    const url = getUrl(config)
    const abortController = new AbortController()
    config.signal = abortController.signal
    if (!pendingMap.has(url)) {
      pendingMap.set(url, abortController)
    }
  }
  // 清楚重複請求
  removePending (config: AxiosRequestConfig) {
    const url = getUrl(config)
    if (pendingMap.has(url)) {
      const abortController = pendingMap.get(url)
      abortController?.abort()
      pendingMap.delete(url)
    }
  }

  removeAllPending () {
    pendingMap.forEach((abortController) => {
      abortController.abort()
    })
    this.clear()
  }

  clear () {
    pendingMap.clear()
  }
}

export default AbortAxios