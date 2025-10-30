interface AuthData {
  username: string
  token: string
}
export interface LoginResponse {
  message: string
  data: AuthData | null
}

export interface SignUpResponse {
  message: string
  data: AuthData | null
}
