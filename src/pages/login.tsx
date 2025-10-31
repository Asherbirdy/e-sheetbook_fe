import {
  Box, Button, Card, Container, Flex, Heading, Stack, Text, Link as ChakraLink,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuthApi } from '@/api/useAuthApi'
import { LoginPayload } from '@/types'
import { LoginForm } from '@/components'
import { cookie } from '@/utils'
import { CookieEnum } from '@/enums'
import { toaster } from '@/components/ui/toaster'
import { config } from '@/config'
// eslint-disable-next-line react-refresh/only-export-components
export const state = {
  data: {
    email: signal(config.test.email || ''),
    password: signal(config.test.password || ''),
  },
}

const Login = () => {
  const navigate = useNavigate()

  const feature = { button: { disabled: useSignal(false) } }
  /*
    * 登入 mutation
  */
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: LoginPayload) => useAuthApi.login(payload),
    onSuccess: (response) => {
      cookie.set(CookieEnum.AccessToken, response.data.token.accessTokenJWT)
      cookie.set(CookieEnum.RefreshToken, response.data.token.refreshTokenJWT)
      navigate('/dashboard')
    },
    onError: () => {
      toaster.error({
        title: '登入失敗',
        description: '請檢查您的帳號和密碼',
      })
      state.data.password.value = ''
    },
  })

  /*
    * 登入
  */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({
      email: state.data.email.value,
      password: state.data.password.value,
    })
  }

  effect(() => {
    const check = (
      !state.data.email.value ||
      !state.data.password.value
    )
    feature.button.disabled.value = check
  })

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
              <LoginForm />

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
                loading={isPending}
                loadingText="登入中..."
                w="full"
                mt={2}
                onClick={handleSubmit}
                disabled={feature.button.disabled.value}
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
