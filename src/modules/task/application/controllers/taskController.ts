import {Body, Controller, Get, HttpCode, HttpStatus, Post} from '@nestjs/common'
import {TaskService} from '../services/taskService'

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Get()
  getTask(): string {
    return this.taskService.getTaskDetails()
  }
}
