import {Injectable} from '@nestjs/common'

@Injectable()
export class UserService {
  getProfileDetails(): string {
    return 'Hi Amit !! Welcome to QuestionPro'
  }
}
