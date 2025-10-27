import {Module} from '@nestjs/common'
import {UserController} from './application/controllers/userController'
import {UserService} from './application/services/userService'

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
