interface AuthData {
  username: string
  token: string
}
export interface LoginResponse {
  message: string
  data: AuthData | null
}
