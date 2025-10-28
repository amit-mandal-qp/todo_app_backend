import {Injectable} from '@nestjs/common'

@Injectable()
export class TaskService {
  getTaskDetails(): string {
    return 'Hi Amit !! Welcome to QuestionPro'
  }
}
