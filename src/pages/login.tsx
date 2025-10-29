import {
  Box, Button, Card, Container, Flex, Heading, Input, Stack, Text, Link as ChakraLink, IconButton,
} from '@chakra-ui/react'
import { Field } from '@/components/ui/field'
import { toaster } from '@/components/ui/toaster'
import { useMutation } from '@tanstack/react-query'
import { useAuthApi } from '@/api/apis/useAuthApi'
import { LoginPayload } from '@/types'
import { useNavigate } from 'react-router-dom'
import { useSignal } from '@preact/signals-react'
import {
  LuEye, LuEyeOff,
} from 'react-icons/lu'
import { AxiosError } from 'axios'

// 驗證函數
const validateEmail = (emailValue: string) => {
  if (!emailValue) {
    return '電子郵件為必填'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(emailValue)) {
    return '請輸入有效的電子郵件'
  }
  return ''
}

const validatePassword = (passwordValue: string) => {
  if (!passwordValue) {
    return '密碼為必填'
  }
  if (passwordValue.length < 6) {
    return '密碼至少需要 6 個字元'
  }
  return ''
}

const Login = () => {
  const navigate = useNavigate()

  const state = {
    data: {
      email: useSignal(''),
      password: useSignal(''),
    },
    features: {
      showPassword: useSignal(false),
      errors: {
        email: useSignal(''),
        password: useSignal(''),
      },
      touched: {
        email: useSignal(false),
        password: useSignal(false),
      },
    },
  }

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => useAuthApi.login(payload),
    onSuccess: (response) => {
      const {
        user, token,
      } = response.data

      // 儲存 token 和 user role
      localStorage.setItem('token', token.accessTokenJWT)
      localStorage.setItem('refreshToken', token.refreshTokenJWT)
      localStorage.setItem('userRole', user.role)
      localStorage.setItem('userId', user.userId)
      localStorage.setItem('userName', user.name)

      toaster.create({
        title: '登入成功',
        description: `歡迎回來，${user.name}！`,
        type: 'success',
        duration: 3000,
      })

      // 清空表單
      state.data.email.value = ''
      state.data.password.value = ''
      state.features.showPassword.value = false
      state.features.errors.email.value = ''
      state.features.errors.password.value = ''
      state.features.touched.email.value = false
      state.features.touched.password.value = false

      // 導航到 dashboard
      navigate('/dashboard')
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = error.response?.data?.message || '登入失敗，請檢查您的帳號和密碼'

      toaster.create({
        title: '登入失敗',
        description: errorMessage,
        type: 'error',
        duration: 5000,
      })
    },
  })

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    state.data.email.value = e.target.value

    // 即時驗證 (只在已觸碰時)
    if (state.features.touched.email.value) {
      state.features.errors.email.value = validateEmail(e.target.value)
    }
  }

  // 處理 Password 輸入變更
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    state.data.password.value = e.target.value

    // 即時驗證 (只在已觸碰時)
    if (state.features.touched.password.value) {
      state.features.errors.password.value = validatePassword(e.target.value)
    }
  }

  // 處理 Email 失焦
  const handleEmailBlur = () => {
    state.features.touched.email.value = true
    state.features.errors.email.value = validateEmail(state.data.email.value)
  }

  // 處理 Password 失焦
  const handlePasswordBlur = () => {
    state.features.touched.password.value = true
    state.features.errors.password.value = validatePassword(state.data.password.value)
  }

  // 處理表單提交
  const handleSubmit = (e: React.FormEvent) => {
    console.log({
      email: state.data.email.value,
      password: state.data.password.value,
    })
    e.preventDefault()

    // 驗證所有欄位
    const emailErr = validateEmail(state.data.email.value)
    const passwordErr = validatePassword(state.data.password.value)

    state.features.errors.email.value = emailErr
    state.features.errors.password.value = passwordErr
    state.features.touched.email.value = true
    state.features.touched.password.value = true

    // 如果有錯誤，不提交
    if (emailErr || passwordErr) {
      return
    }

    // 提交表單
    loginMutation.mutate({
      email: state.data.email.value,
      password: state.data.password.value,
    })
  }

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="gray.50"
      _dark={{ bg: 'gray.900' }}
    >
      <Container
        maxW="md"
        py={12}
      >
        <Card.Root
          p={8}
          shadow="xl"
          borderRadius="xl"
          bg="white"
          _dark={{ bg: 'gray.800' }}
        >
          {/* Logo 和標題 */}
          <Stack
            gap={6}
            mb={8}
            textAlign="center"
          >
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
              <Text
                color="gray.600"
                _dark={{ color: 'gray.400' }}
              >
                登入您的帳戶
              </Text>
            </Box>
          </Stack>

          {/* 登入表單 */}
          <form onSubmit={handleSubmit}>
            <Stack gap={5}>
              {/* Email 輸入 */}
              <Field
                label="電子郵件"
                invalid={!!(state.features.errors.email.value && state.features.touched.email.value)}
                errorText={state.features.errors.email.value}
              >
                <Input
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={state.data.email.value}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  size="lg"
                  borderRadius="md"
                />
              </Field>

              {/* Password 輸入 */}
              <Field
                label="密碼"
                invalid={!!(state.features.errors.password.value && state.features.touched.password.value)}
                errorText={state.features.errors.password.value}
              >
                <Box position="relative">
                  <Input
                    name="password"
                    type={state.features.showPassword.value ? 'text' : 'password'}
                    placeholder="請輸入您的密碼"
                    value={state.data.password.value}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    size="lg"
                    borderRadius="md"
                    pr={12}
                  />
                  <IconButton
                    position="absolute"
                    right={2}
                    top="50%"
                    transform="translateY(-50%)"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      state.features.showPassword.value = !state.features.showPassword.value
                    }}
                    aria-label={state.features.showPassword.value ? '隱藏密碼' : '顯示密碼'}
                  >
                    {state.features.showPassword.value ? <LuEyeOff /> : <LuEye />}
                  </IconButton>
                </Box>
              </Field>

              {/* 忘記密碼連結 */}
              <Flex justify="flex-end">
                <ChakraLink
                  href="/forgot-password"
                  fontSize="sm"
                  color="blue.500"
                  _hover={{ color: 'blue.600' }}
                >
                  忘記密碼？
                </ChakraLink>
              </Flex>

              {/* 登入按鈕 */}
              <Button
                type="submit"
                size="lg"
                colorScheme="blue"
                bgGradient="to-r"
                gradientFrom="blue.400"
                gradientTo="purple.500"
                _hover={{
                  bgGradient: 'to-r',
                  gradientFrom: 'blue.500',
                  gradientTo: 'purple.600',
                }}
                loading={loginMutation.isPending}
                loadingText="登入中..."
                w="full"
                mt={2}
                onClick={handleSubmit}
              >
                登入
              </Button>
            </Stack>
          </form>

          {/* 註冊連結 */}
          <Text
            textAlign="center"
            mt={6}
            fontSize="sm"
            color="gray.600"
            _dark={{ color: 'gray.400' }}
          >
            還沒有帳戶？
            {' '}
            <ChakraLink
              href="/register"
              color="blue.500"
              fontWeight="semibold"
              _hover={{
                color: 'blue.600',
                textDecoration: 'underline',
              }}
            >
              立即註冊
            </ChakraLink>
          </Text>
        </Card.Root>
      </Container>
    </Flex>
  )
}

export default Login
