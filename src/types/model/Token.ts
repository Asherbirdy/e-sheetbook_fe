export interface TokenSchema {
  _id: string
  refreshToken: string
  ip: string
  userAgent: string
  isValid: boolean
  user: string
  createdAt: string
  updatedAt: string
}
