import {
  Box, Flex, Input, Stack, IconButton, Link as ChakraLink, Field,
} from '@chakra-ui/react'
import { useSignal } from '@preact/signals-react'
import { LuEye, LuEyeOff } from 'react-icons/lu'
import { state } from '@/pages/login'
import { formValidate } from '@/utils'

export const LoginForm = () => {

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
    state.data.email.value = e.target.value

    // 即時驗證 (只在已觸碰時)
    if (features.touched.email.value) {
      features.errors.email.value = formValidate.email(e.target.value)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    state.data.password.value = e.target.value

    // 即時驗證 (只在已觸碰時)
    if (features.touched.password.value) {
      features.errors.password.value = formValidate.password(e.target.value)
    }
  }

  const handleEmailBlur = () => {
    features.touched.email.value = true
    features.errors.email.value = formValidate.email(state.data.email.value)
  }

  const handlePasswordBlur = () => {
    features.touched.password.value = true
    features.errors.password.value = formValidate.password(state.data.password.value)
  }

  return (
    <Stack gap={5}>
      {/* Email 輸入 */}
      <Field.Root
        invalid={!!(features.errors.email.value && features.touched.email.value)}
      >
        <Field.Label>電子郵件</Field.Label>
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
        {features.errors.email.value && features.touched.email.value && (
          <Field.ErrorText>{features.errors.email.value}</Field.ErrorText>
        )}
      </Field.Root>

      {/* Password 輸入 */}
      <Field.Root
        invalid={!!(features.errors.password.value && features.touched.password.value)}
      >
        <Field.Label>密碼</Field.Label>
        <Box position="relative">
          <Input
            name="password"
            type={features.showPassword.value ? 'text' : 'password'}
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
              features.showPassword.value = !features.showPassword.value
            }}
            aria-label={features.showPassword.value ? '隱藏密碼' : '顯示密碼'}
          >
            {features.showPassword.value ? <LuEyeOff /> : <LuEye />}
          </IconButton>
        </Box>
        {features.errors.password.value && features.touched.password.value && (
          <Field.ErrorText>{features.errors.password.value}</Field.ErrorText>
        )}
      </Field.Root>

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

