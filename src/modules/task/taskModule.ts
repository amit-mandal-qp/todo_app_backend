import {Module} from '@nestjs/common'
import {TaskController} from './application/controllers/taskController'
import {TaskService} from './application/services/taskService'

@Module({
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
