import {
  Box, Flex, Input, Stack, IconButton, Link as ChakraLink,
} from '@chakra-ui/react'
import { Field } from '@/components/ui/field'
import { signal, useSignal } from '@preact/signals-react'
import { LuEye, LuEyeOff } from 'react-icons/lu'
import { state } from '@/pages/login'

// 驗證函數
export const validateEmail = (emailValue: string) => {
  if (!emailValue) {
    return '電子郵件為必填'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(emailValue)) {
    return '請輸入有效的電子郵件'
  }
  return ''
}

export const validatePassword = (passwordValue: string) => {
  if (!passwordValue) {
    return '密碼為必填'
  }
  if (passwordValue.length < 6) {
    return '密碼至少需要 6 個字元'
  }
  return ''
}

// 表單驗證和 UI 狀態

const CLoginForm = () => {

const features = {
  showPassword: useSignal(false),
  errors: {
    email: useSignal(''),
    password: useSignal(''),
  },
  touched: {
    email: useSignal(false),
    password: useSignal(false),
  },
}


  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    state.email.value = e.target.value

    // 即時驗證 (只在已觸碰時)
    if (features.touched.email.value) {
      features.errors.email.value = validateEmail(e.target.value)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    state.password.value = e.target.value

    // 即時驗證 (只在已觸碰時)
    if (features.touched.password.value) {
      features.errors.password.value = validatePassword(e.target.value)
    }
  }

  const handleEmailBlur = () => {
    features.touched.email.value = true
    features.errors.email.value = validateEmail(state.email.value)
  }

  const handlePasswordBlur = () => {
    features.touched.password.value = true
    features.errors.password.value = validatePassword(state.password.value)
  }

  return (
    <Stack gap={5}>
      {/* Email 輸入 */}
      <Field
        label="電子郵件"
        invalid={!!(features.errors.email.value && features.touched.email.value)}
        errorText={features.errors.email.value}
      >
        <Input
          name="email"
          type="email"
          placeholder="your@email.com"
          value={state.email.value}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
          size="lg"
          borderRadius="md"
        />
      </Field>

      {/* Password 輸入 */}
      <Field
        label="密碼"
        invalid={!!(features.errors.password.value && features.touched.password.value)}
        errorText={features.errors.password.value}
      >
        <Box position="relative">
          <Input
            name="password"
            type={features.showPassword.value ? 'text' : 'password'}
            placeholder="請輸入您的密碼"
            value={state.password.value}
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
              features.showPassword.value = !features.showPassword.value
            }}
            aria-label={features.showPassword.value ? '隱藏密碼' : '顯示密碼'}
          >
            {features.showPassword.value ? <LuEyeOff /> : <LuEye />}
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
    </Stack>
  )
}

export default CLoginForm
