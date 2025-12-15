import {
  Box, Button, Field, Flex, HStack, Input, PinInput, Stack, Text,
} from '@chakra-ui/react'
import { useAuthApi } from '@/api/useAuthApi'
import { toaster } from '@/components/ui/toaster'

interface RegisterFormProps {
  onSuccess?: () => void
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const data = {
    name: useSignal(''),
    email: useSignal(''),
    password: useSignal(''),
    confirmPassword: useSignal(''),
    otp: useSignal(''),
  }

  const features = {
    step: useSignal<'form' | 'otp'>('form'),
    isOtpSent: useSignal(false),
  }

  // 發送 OTP mutation
  const sendOtp = useMutation({
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
  const register = useMutation({
    mutationFn: () => useAuthApi.register({
      name: data.name.value,
      email: data.email.value,
      password: data.password.value,
      OTP: data.otp.value,
    }),
    onSuccess: () => {
      toaster.success({ title: '註冊成功', description: '請登入您的帳戶' })
      // 重置表單
      data.name.value = ''
      data.email.value = ''
      data.password.value = ''
      data.confirmPassword.value = ''
      data.otp.value = ''
      features.step.value = 'form'

      // 呼叫 onSuccess callback
      onSuccess?.()
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
    sendOtp.mutate()
  }

  // 處理註冊
  const handleRegister = () => {
    if (data.otp.value.length !== 6) {
      toaster.error({ title: '請輸入完整的驗證碼' })
      return
    }
    register.mutate()
  }

  // 返回表單
  const handleBackToForm = () => {
    features.step.value = 'form'
    data.otp.value = ''
  }

  if (features.step.value === 'otp') {
    return (
      <Stack gap={6}>
        {/* OTP 輸入 */}
        <Box>
          <Field.Label textAlign="center" mb={4}>
            請輸入 6 位數驗證碼
          </Field.Label>
          <Flex justify="center">
            <PinInput.Root
              value={data.otp.value.split('')}
              onValueChange={(details) => {
                data.otp.value = details.value.join('')
              }}
              placeholder="0"
            >
              <PinInput.Control>
                <HStack gap={2}>
                  {[0, 1, 2, 3, 4, 5].map((id) => (
                    <PinInput.Input key={id} index={id} />
                  ))}
                </HStack>
              </PinInput.Control>
            </PinInput.Root>
          </Flex>
          <Text
            fontSize="sm"
            color="gray.600"
            textAlign="center"
            mt={4}
          >
            已發送至
            {' '}
            {data.email.value}
          </Text>
        </Box>

        {/* 確認按鈕 */}
        <Button
          size="lg"
          w="full"
          onClick={handleRegister}
          disabled={data.otp.value.length !== 6}
          loading={register.isPending}
        >
          完成註冊
        </Button>

        {/* 返回按鈕 */}
        <Button
          variant="ghost"
          size="lg"
          w="full"
          onClick={handleBackToForm}
        >
          返回修改資料
        </Button>
      </Stack>
    )
  }

  return (
    <form onSubmit={handleSendOtp}>
      <Stack gap={4}>
        {/* 姓名欄位 */}
        <Field.Root required>
          <Field.Label>姓名</Field.Label>
          <Input
            type="text"
            placeholder="請輸入您的姓名"
            value={data.name.value}
            onChange={(e) => { data.name.value = e.target.value }}
            size="lg"
          />
        </Field.Root>

        {/* Email 欄位 */}
        <Field.Root required>
          <Field.Label>電子郵件</Field.Label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={data.email.value}
            onChange={(e) => { data.email.value = e.target.value }}
            size="lg"
          />
        </Field.Root>

        {/* 密碼欄位 */}
        <Field.Root required>
          <Field.Label>密碼</Field.Label>
          <Input
            type="password"
            placeholder="至少 6 個字元"
            value={data.password.value}
            onChange={(e) => { data.password.value = e.target.value }}
            size="lg"
          />
          <Field.HelperText>密碼至少需要 6 個字元</Field.HelperText>
        </Field.Root>

        {/* 確認密碼欄位 */}
        <Field.Root
          required
          invalid={data.confirmPassword.value !== '' && data.password.value !== data.confirmPassword.value}
        >
          <Field.Label>確認密碼</Field.Label>
          <Input
            type="password"
            placeholder="請再次輸入密碼"
            value={data.confirmPassword.value}
            onChange={(e) => { data.confirmPassword.value = e.target.value }}
            size="lg"
          />
          {data.confirmPassword.value !== '' && data.password.value !== data.confirmPassword.value && (
            <Field.ErrorText>密碼不一致</Field.ErrorText>
          )}
        </Field.Root>

        {/* 提交按鈕 */}
        <Button
          type="submit"
          size="lg"
          w="full"
          mt={2}
          disabled={!isFormValid.value}
          loading={sendOtp.isPending}
        >
          發送驗證碼
        </Button>
      </Stack>
    </form>
  )
}
