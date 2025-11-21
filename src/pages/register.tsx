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
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="gray.50"
      _dark={{ bg: 'gray.900' }}
    >
      <Container maxW="md" py={12}>
        <Card.Root
          p={8}
          shadow="xl"
          borderRadius="xl"
          bg="white"
          _dark={{ bg: 'gray.800' }}
        >
          {/* Logo 和標題 */}
          <Stack gap={6} mb={8} textAlign="center">
            <Box>
              <Heading
                size="2xl"
                bgGradient="to-r"
                gradientFrom="blue.400"
                gradientTo="purple.500"
                bgClip="text"
                mb={2}
              >
                eSheetBook
              </Heading>
              <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                {features.step.value === 'form' ? '建立您的帳戶' : '輸入驗證碼'}
              </Text>
            </Box>
          </Stack>

          {/* 表單步驟 */}
          {features.step.value === 'form' && (
            <form onSubmit={handleSendOtp}>
              <Stack gap={5}>
                <Field.Root>
                  <Field.Label>姓名</Field.Label>
                  <Input
                    value={data.name.value}
                    onChange={(e) => { data.name.value = e.target.value }}
                    placeholder="請輸入您的姓名"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>電子郵件</Field.Label>
                  <Input
                    type="email"
                    value={data.email.value}
                    onChange={(e) => { data.email.value = e.target.value }}
                    placeholder="請輸入電子郵件"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>密碼</Field.Label>
                  <Input
                    type="password"
                    value={data.password.value}
                    onChange={(e) => { data.password.value = e.target.value }}
                    placeholder="請輸入密碼"
                  />
                  <Field.HelperText>密碼至少需要 6 個字元</Field.HelperText>
                </Field.Root>

                <Field.Root
                  invalid={
                    data.confirmPassword.value !== '' &&
                    data.password.value !== data.confirmPassword.value
                  }
                >
                  <Field.Label>確認密碼</Field.Label>
                  <Input
                    type="password"
                    value={data.confirmPassword.value}
                    onChange={(e) => { data.confirmPassword.value = e.target.value }}
                    placeholder="請再次輸入密碼"
                  />
                  <Field.ErrorText>密碼不一致</Field.ErrorText>
                </Field.Root>

                <Button
                  type="submit"
                  size="lg"
                  bgGradient="to-r"
                  gradientFrom="blue.400"
                  gradientTo="purple.500"
                  _hover={{
                    bgGradient: 'to-r',
                    gradientFrom: 'blue.500',
                    gradientTo: 'purple.600',
                  }}
                  loading={isSendingOtp}
                  loadingText="發送中..."
                  w="full"
                  mt={2}
                  disabled={!isFormValid.value}
                >
                  發送驗證碼
                </Button>
              </Stack>
            </form>
          )}

          {/* OTP 驗證步驟 */}
          {features.step.value === 'otp' && (
            <Stack gap={6}>
              <Text textAlign="center" color="gray.600" _dark={{ color: 'gray.400' }}>
                我們已將 6 位數驗證碼發送至
                <br />
                <Text as="span" fontWeight="bold" color="blue.500">
                  {data.email.value}
                </Text>
              </Text>

              <HStack justify="center">
                <PinInput.Root
                  value={data.otp.value.split('')}
                  onValueChange={(e) => { data.otp.value = e.value.join('') }}
                  otp
                  size="lg"
                >
                  <PinInput.Control>
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <PinInput.Input key={index} index={index} />
                    ))}
                  </PinInput.Control>
                </PinInput.Root>
              </HStack>

              <Stack gap={3}>
                <Button
                  size="lg"
                  bgGradient="to-r"
                  gradientFrom="blue.400"
                  gradientTo="purple.500"
                  _hover={{
                    bgGradient: 'to-r',
                    gradientFrom: 'blue.500',
                    gradientTo: 'purple.600',
                  }}
                  loading={isRegistering}
                  loadingText="註冊中..."
                  w="full"
                  onClick={handleRegister}
                  disabled={data.otp.value.length !== 6}
                >
                  完成註冊
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { features.step.value = 'form' }}
                >
                  返回修改資料
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendOtpMutation()}
                  loading={isSendingOtp}
                  disabled={isSendingOtp}
                >
                  重新發送驗證碼
                </Button>
              </Stack>
            </Stack>
          )}

          {/* 登入連結 */}
          <Text
            textAlign="center"
            mt={6}
            fontSize="sm"
            color="gray.600"
            _dark={{ color: 'gray.400' }}
          >
            已有帳戶？
            {' '}
            <ChakraLink
              onClick={() => navigate('/login')}
              color="blue.500"
              fontWeight="semibold"
              _hover={{
                color: 'blue.600',
                textDecoration: 'underline',
              }}
            >
              立即登入
            </ChakraLink>
          </Text>
        </Card.Root>
      </Container>
    </Flex>
  )
}

export default Register
