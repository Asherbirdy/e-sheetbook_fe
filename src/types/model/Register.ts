export interface RegisterSchema {
  _id: string
  email: string
  OTP?: string
  OTPCreatedTime?: string
  OTPAttempts: number
  isBlocked: boolean
  blockUntil?: string
  verified: boolean
  createdAt: string
  expiresAt: string
}
