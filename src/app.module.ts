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
import {TaskModule} from '@modules/task/taskModule'
import {TaskController} from '@modules/task/application/controllers/taskController'
import {TaskService} from '@modules/task/application/services/taskService'

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
    TaskModule,
    DatabaseModule,
  ],
  controllers: [AppController, AuthController, TaskController],
  providers: [AppService, AuthService, TaskService],
})
export class AppModule {}
