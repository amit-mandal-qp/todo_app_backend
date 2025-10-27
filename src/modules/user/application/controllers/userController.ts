import {Controller, Get} from '@nestjs/common'
import {UserService} from '../services/userService'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  getProfile(): string {
    return this.userService.getProfileDetails()
  }
}
