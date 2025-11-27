import { FunctionComponent, ReactElement } from 'react'
import {
  Box, HStack, Text, Avatar, Dialog, Portal, Button, Stack,
} from '@chakra-ui/react'
import { LuFlower2 } from 'react-icons/lu'
import { useAuthApi } from '@/api/useAuthApi'
import { LoginPayload } from '@/types'
import { LoginForm } from '@/components'
import { cookie } from '@/utils'
import { CookieEnum } from '@/enums'
import { toaster } from '@/components/ui/toaster'
import { LoginState as state } from '@/stores'
import { useNavigate } from 'react-router-dom'

const HomeHeader: FunctionComponent = (): ReactElement => {
  const navigate = useNavigate()

  // Dialog 狀態
  const feature = {
    dialog: { login: { status: useSignal(false) } },
    isLogin: useSignal(false),
  }

  // 登入 mutation
  const login = useMutation({
    mutationFn: (payload: LoginPayload) => useAuthApi.login(payload),
    onSuccess: (response) => {
      cookie.set(CookieEnum.AccessToken, response.data.token.accessTokenJWT)
      cookie.set(CookieEnum.RefreshToken, response.data.token.refreshTokenJWT)
      toaster.success({
        title: '登入成功',
        description: '歡迎回來!',
      })
      feature.dialog.login.status.value = false
      feature.isLogin.value = true
    },
    onError: () => {
      toaster.error({
        title: '登入失敗',
        description: '請檢查您的帳號和密碼',
      })
      state.login.password.value = ''
    },
  })

  // 處理登入提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login.mutateAsync({
      email: state.login.email.value,
      password: state.login.password.value,
    })
  }

  // 關閉 Dialog
  const closeLoginDialog = () => {
    feature.dialog.login.status.value = false
    state.login.email.value = ''
    state.login.password.value = ''
  }

  return (
    <>
      <Box
        as="header"
        py={4}
        borderColor="gray.200"
      >
        <HStack justify="space-between" px={8}>
          {/* Logo 區塊 */}
          <HStack gap={2}>
            <LuFlower2 size={24} />
            <Text fontSize="xl" fontWeight="bold">
              E-sheetbook
            </Text>
          </HStack>

          {/* 導航選單 */}
          <HStack gap={8}>
            {feature.isLogin.value ? '已登入' : '未登入'}
            <Text
              fontWeight="semibold" cursor="pointer" _hover={{ color: 'gray.600' }}
              onClick={() => navigate('/')}
            >
              Home
            </Text>
            {feature.isLogin.value && (
              <Text
                fontWeight="semibold"
                cursor="pointer"
                _hover={{ color: 'gray.600' }}
                onClick={() => navigate('/file')}
              >
                Files
              </Text>
            )}
          </HStack>

          {/* 使用者頭像 */}
          <Box display="flex" alignItems="center" gap={2}>

            {!feature.isLogin.value && (
              <Button
                size="sm"
                variant="subtle"
                onClick={() => { feature.dialog.login.status.value = true }}
              >
                Login
              </Button>
            )}

            {!feature.isLogin.value && (
              <Button
                size="sm"
                onClick={() => { feature.dialog.login.status.value = true }}
              >
                Register
              </Button>
            )}

            {feature.isLogin.value && (
              <Avatar.Root size="md">
                <Avatar.Image src="https://bit.ly/broken-link" />
                <Avatar.Fallback>U</Avatar.Fallback>
              </Avatar.Root>
            )}

            {feature.isLogin.value && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => { feature.dialog.login.status.value = true }}
              >
                Logout
              </Button>
            )}
          </Box>
        </HStack>
      </Box>

      {/* 登入對話框 */}
      <Dialog.Root
        open={feature.dialog.login.status.value}
        onOpenChange={(e) => { if (!e.open) closeLoginDialog() }}
        size="md"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>歡迎回來</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <form onSubmit={handleSubmit}>
                  <Stack gap={6}>
                    <LoginForm />
                    <Button
                      type="submit"
                      size="lg"
                      w="full"
                      disabled={state.login.email.value === '' || state.login.password.value === ''}
                      loading={login.isPending}
                    >
                      登入
                    </Button>
                  </Stack>
                </form>
              </Dialog.Body>
              <Dialog.CloseTrigger />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  )
}

export default HomeHeader
