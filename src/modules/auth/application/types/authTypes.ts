export interface AuthData {
  username: string
  token: string
}

export interface SignUpResponse {
  message: string
  data: AuthData | null
}
