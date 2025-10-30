export const formValidate = {
  email: (emailValue: string) => {
    if (!emailValue) {
      return '電子郵件為必填'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailValue)) {
      return '請輸入有效的電子郵件'
    }
    return ''
  },
  password: (passwordValue: string) => {
    if (!passwordValue) {
      return '密碼為必填'
    }
    if (passwordValue.length < 6) {
      return '密碼至少需要 6 個字元'
    }
    return ''
  },
}
