import { FunctionComponent, ReactElement } from 'react'
import {
  Box, HStack, Text, Avatar, Dialog, Portal, Button, Stack,
} from '@chakra-ui/react'
import { LuFlower2 } from 'react-icons/lu'
import { useAuthApi } from '@/api/useAuthApi'
import { LoginPayload } from '@/types'
import { LoginForm, RegisterForm } from '@/components'
import { cookie } from '@/utils'
import { CookieEnum, CRoutes } from '@/enums'
import { toaster } from '@/components/ui/toaster'
import { LoginState as state, useAuthStore } from '@/stores'
import { useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'

const HomeHeader: FunctionComponent = (): ReactElement => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isLogin = useAuthStore((state) => state.isLogin)
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated)

  // Dialog 狀態
  const dialog = {
    login: { status: useSignal(false) },
    register: { status: useSignal(false) },
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
      dialog.login.status.value = false
      setIsAuthenticated(true)
    },
    onError: () => {
      toaster.error({
        title: '登入失敗',
        description: '請檢查您的帳號和密碼',
      })
      state.login.password.value = ''
    },
  })

  // 登出 mutation
  const logout = useMutation({
    mutationFn: () => useAuthApi.logout(),
    onSuccess: () => {
      // 清除 Cookie
      cookie.remove(CookieEnum.AccessToken)
      cookie.remove(CookieEnum.RefreshToken)

      // 清除所有 React Query 快取
      queryClient.clear()

      // 設定登入狀態為 false
      setIsAuthenticated(false)

      // 顯示登出成功訊息
      toaster.success({
        title: '登出成功',
        description: '期待您的再次光臨!',
      })

      // 導航到首頁
      navigate(CRoutes.Home)
    },
    onError: () => {
      toaster.error({
        title: '登出失敗',
        description: '請稍後再試',
      })
    },
  })

  // 處理登出
  const handleLogout = () => {
    logout.mutate()
  }

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
    dialog.login.status.value = false
    state.login.email.value = ''
    state.login.password.value = ''
  }

  useEffect(() => {
    useAuthStore.getState().checkLogin()
  }, [])

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
            <Link to={CRoutes.Home}>
              <Text
                fontWeight="semibold" cursor="pointer" _hover={{ color: 'gray.600' }}
              >
                Home
              </Text>
            </Link>
            {isLogin && (
              <Link to={CRoutes.File}>
                <Text
                  fontWeight="semibold"
                  cursor="pointer"
                  _hover={{ color: 'gray.600' }}
                >
                  Files
                </Text>
              </Link>
            )}
          </HStack>

          {/* 使用者頭像 */}
          <Box display="flex" alignItems="center" gap={2}>
            {!isLogin && (
              <>
                <Button
                  size="sm"
                  variant="subtle"
                  onClick={() => { dialog.login.status.value = true }}
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => { dialog.register.status.value = true }}
                >
                  Register
                </Button>
              </>
            )}

            {isLogin && (
              <>
                <Avatar.Root size="md">
                  <Avatar.Image src="https://bit.ly/broken-link" />
                  <Avatar.Fallback>U</Avatar.Fallback>
                </Avatar.Root>
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={handleLogout}
                  loading={logout.isPending}
                >
                  Logout
                </Button>
              </>
            )}
          </Box>
        </HStack>
      </Box>

      {/* 登入對話框 */}
      <Dialog.Root
        open={dialog.login.status.value}
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

      {/* 註冊對話框 */}
      <Dialog.Root
        open={dialog.register.status.value}
        onOpenChange={(e) => { if (!e.open) dialog.register.status.value = false }}
        size="md"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>建立帳戶</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <RegisterForm
                  onSuccess={() => {
                    dialog.register.status.value = false
                    dialog.login.status.value = true
                  }}
                />
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
