import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {UserModule} from '@modules/user/users.module'
import {ConfigModule} from '@nestjs/config'
import {loadAppConfig} from './config/loadAppConfig'
import * as path from 'path'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [loadAppConfig],
      isGlobal: true,
      envFilePath: [
        path.resolve(__dirname, `./config/.env.${process.env.ENVIRONMENT}`),
      ],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
