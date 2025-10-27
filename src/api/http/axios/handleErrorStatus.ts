export function handleErrorStatus (
  status: number | undefined,
  message: string | undefined,
  callback: (errorMessage: string)=> any
) {
  let errorMessage = message ?? ''
  switch (status) {
    case 400:
      errorMessage = '[ Client Error: 400 ] 客戶端錯誤，請求格式或參數有誤！'
      break
    case 401:
      errorMessage = '[ Client Error: 401 ] 身份認證未通過! 請重新登入！'
      break
    case 403:
      errorMessage = '[ Client Error: 403 ] 用戶已獲得授權，但訪問被禁止！'
      break
    case 404:
      errorMessage = '[ Client Error: 404 ] 找不到網頁 或 未知的請求！'
      break
    case 500:
      errorMessage = '[ Server Error: 500 ] 伺服器錯誤！'
      break
    case 503:
      errorMessage = '[ Server Error: 503 ] 服務器錯誤！'
      break
  }
  if (errorMessage.length > 0) {
    callback(`${errorMessage}`)
  }
}
