import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {AuthModule} from '@modules/auth/auth.module'
import {ConfigModule} from '@nestjs/config'
import {loadAppConfig} from './config/loadAppConfig'
import * as path from 'path'
import {AuthController} from '@modules/auth/application/controllers/authController'
import {AuthService} from '@modules/auth/application/services/authService'
import {DatabaseModule} from './typeOrmConfig'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [loadAppConfig],
      isGlobal: true,
      envFilePath: [
        path.resolve(__dirname, `./config/.env.${process.env.ENVIRONMENT}`),
      ],
    }),
    AuthModule,
    DatabaseModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
