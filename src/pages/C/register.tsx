import {
  Box, Button, Card, Container, Field, Flex, Heading, HStack, Input, PinInput, Stack, Text,
  Link as ChakraLink,
} from '@chakra-ui/react'
import { useAuthApi } from '@/api/useAuthApi'
import { toaster } from '@/components/ui/toaster'

const Register = () => {
  const navigate = useNavigate()

  const data = {
    name: useSignal(''),
    email: useSignal(''),
    password: useSignal(''),
    confirmPassword: useSignal(''),
    otp: useSignal(''),
  }

  const features = {
    step: useSignal<'form' | 'otp'>('form'), // form: 填寫表單, otp: 驗證 OTP
    isOtpSent: useSignal(false),
  }

  // 發送 OTP mutation
  const { mutate: sendOtpMutation, isPending: isSendingOtp } = useMutation({
    mutationFn: () => useAuthApi.sendOTPtoEmail({ email: data.email.value }),
    onSuccess: () => {
      toaster.success({ title: '驗證碼已發送', description: '請檢查您的信箱' })
      features.step.value = 'otp'
      features.isOtpSent.value = true
    },
    onError: () => {
      toaster.error({ title: '發送失敗', description: '請稍後再試' })
    },
  })

  // 註冊 mutation
  const { mutate: registerMutation, isPending: isRegistering } = useMutation({
    mutationFn: () => useAuthApi.register({
      name: data.name.value,
      email: data.email.value,
      password: data.password.value,
      OTP: data.otp.value,
    }),
    onSuccess: () => {
      toaster.success({ title: '註冊成功', description: '請登入您的帳戶' })
      navigate('/login')
    },
    onError: () => {
      toaster.error({ title: '註冊失敗', description: '驗證碼錯誤或已過期' })
      data.otp.value = ''
    },
  })

  // 驗證表單
  const isFormValid = computed(() => {
    return (
      data.name.value.trim() !== '' &&
      data.email.value.trim() !== '' &&
      data.password.value.length >= 6 &&
      data.password.value === data.confirmPassword.value
    )
  })

  // 處理發送 OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid.value) return
    sendOtpMutation()
  }

  // 處理註冊
  const handleRegister = () => {
    if (data.otp.value.length !== 6) {
      toaster.error({ title: '請輸入完整的驗證碼' })
      return
    }
    registerMutation()
  }

  return (
    <>
      <h1>Register Page</h1>
    </>
  )
}

export default Register
