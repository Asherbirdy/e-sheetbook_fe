import { config } from '@/config'

export const LoginState = {
  login: {
    email: signal(config.test.email || ''),
    password: signal(config.test.password || ''),
  },
}