export interface UserSchema {
  _id: string
  name: string
  email?: string
  emailVerified: boolean
  OTP?: string
  OTPCreatedTime?: string
  OTPAttempts: number
  isBlocked: boolean
  blockUntil?: string
  password?: string
  role: string
}
