import {
  Box, Button, Card, Container, Flex, Heading, Stack, Text, Link as ChakraLink,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { signal } from '@preact/signals-react'
import { useMutation } from '@tanstack/react-query'
import { useAuthApi } from '@/api/apis/useAuthApi'
import { LoginPayload } from '@/types'
import { toaster } from '@/components/ui/toaster'
import { AxiosError } from 'axios'
import { LoginForm } from '@/components'

// eslint-disable-next-line react-refresh/only-export-components
export const state = {
  data: {
    email: signal(''),
    password: signal(''),
  },
}

const Login = () => {
  const navigate = useNavigate()

  /*
    * 登入 mutation
  */
  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => useAuthApi.login(payload),
    onSuccess: (response) => {
      const { user } = response.data

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

  /*
    * 登入
  */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
