import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  Link as ChakraLink,
  IconButton,
} from '@chakra-ui/react'
import { Field } from '@/components/ui/field'
import { toaster } from '@/components/ui/toaster'
import { useMutation } from '@tanstack/react-query'
import { useAuthApi } from '@/api/apis/useAuthApi'
import { LoginPayload } from '@/types'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LuEye, LuEyeOff,
} from 'react-icons/lu'
import { AxiosError } from 'axios'

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  // 表單狀態
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  // 表單錯誤狀態
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  })

  // 觸碰狀態 (用於控制何時顯示錯誤)
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  })

  // 驗證函數
  const validateEmail = (email: string) => {
    if (!email) {
      return '電子郵件為必填'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return '請輸入有效的電子郵件'
    }
    return ''
  }

  const validatePassword = (password: string) => {
    if (!password) {
      return '密碼為必填'
    }
    if (password.length < 6) {
      return '密碼至少需要 6 個字元'
    }
    return ''
  }

  // 使用 TanStack Query 處理登入
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

  // 處理輸入變更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name, value,
    } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // 即時驗證
    if (touched[name as keyof typeof touched]) {
      const error = name === 'email' ? validateEmail(value) : validatePassword(value)
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }))
    }
  }

  // 處理輸入框失焦
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))

    // 驗證欄位
    const error = name === 'email'
      ? validateEmail(formData.email)
      : validatePassword(formData.password)
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }

  // 處理表單提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 驗證所有欄位
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)

    setErrors({
      email: emailError,
      password: passwordError,
    })

    setTouched({
      email: true,
      password: true,
    })

    // 如果有錯誤，不提交
    if (emailError || passwordError) {
      return
    }

    // 提交表單
    loginMutation.mutate(formData)
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
                invalid={!!(errors.email && touched.email)}
                errorText={errors.email}
              >
                <Input
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="lg"
                  borderRadius="md"
                />
              </Field>

              {/* Password 輸入 */}
              <Field
                label="密碼"
                invalid={!!(errors.password && touched.password)}
                errorText={errors.password}
              >
                <Box position="relative">
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="請輸入您的密碼"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? '隱藏密碼' : '顯示密碼'}
                  >
                    {showPassword ? <LuEyeOff /> : <LuEye />}
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
