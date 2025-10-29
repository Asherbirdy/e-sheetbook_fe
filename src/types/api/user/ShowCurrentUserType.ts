export interface ShowCurrentResponse {
  msg: string
  user: ShowCurrentUser
}

export interface ShowCurrentUser {
  _id: string
  name: string
  emailVerified: boolean
  role: string
  email: string
}