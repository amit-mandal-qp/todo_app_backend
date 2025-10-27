import {AppConfig} from './AppConfig'

export const loadAppConfig = (): AppConfig => {
  const config: AppConfig = {
    app: {
      port: Number(process.env.APP_PORT) || 3000,
    },
    database: {
      default: {
        host: process.env.DATABASE_DEFAULT_HOST!,
        port: parseInt(process.env.DATABASE_DEFAULT_PORT!),
        user: process.env.DATABASE_DEFAULT_USERNAME!,
        password: process.env.DATABASE_DEFAULT_PASSWORD!,
        name: process.env.DATABASE_DEFAULT_DATABASE!,
      },
    },
    session: {
      cookieName: process.env.SESSION_COOKIE_NAME || 'sid',
      secret: process.env.SESSION_SECRET!,
    },
  }
  return config
}
