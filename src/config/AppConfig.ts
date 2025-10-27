export interface AppConfig {
  app: {
    port: number
  }
  database: {
    default: {
      host: string
      port: number
      user: string
      password: string
      name: string
    }
  }
  session: {
    cookieName: string
    secret: string
  }
}
