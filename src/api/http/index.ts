import Axios from './axios/Axios'
import _RequstInterceptors from './axios/requestInterceptors'
import { urlApi } from './config'

// ** 建立個 API 東東
const useApiRequest = new Axios({
  directlyGetData: false,
  baseURL: urlApi,
  timeout: 1000 * 60 * 5,
  interceptors: _RequstInterceptors,
  abortRepetitiveRequest: true,
  retryConfig: {
    count: 0,
    waitTime: 0,
  },
})

export { useApiRequest }
