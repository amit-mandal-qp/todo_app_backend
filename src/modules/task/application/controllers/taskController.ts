import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common'
import {TaskService} from '../services/taskService'
import {
  AuthenticatedRequest,
  ITaskListResponse,
  TaskCreatedResponse,
  TaskUpdateResponse,
} from '../types/taskTypes'
import {CreateTaskDTO, UpdateTaskDTO} from '../dtos/taskDto'

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Get()
  getTask(@Req() authReq: AuthenticatedRequest): string {
    return this.taskService.getTaskDetails()
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createTask(
    @Req() authReq: AuthenticatedRequest,
    @Body() createTaskDTO: CreateTaskDTO,
  ): Promise<TaskCreatedResponse> {
    return this.taskService.createTask(authReq, createTaskDTO)
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  async getAllTasksByUser(
    @Req() authReq: AuthenticatedRequest,
  ): Promise<ITaskListResponse> {
    return this.taskService.getAllTasksByUser(authReq)
  }

  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  async updateTask(
    @Req() authReq: AuthenticatedRequest,
    @Body() updateTaskDTO: UpdateTaskDTO,
    @Param('id') id: string,
  ): Promise<TaskUpdateResponse> {
    return await this.taskService.updateTask(authReq, updateTaskDTO, id)
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteTask(
    @Req() authReq: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<string> {
    return this.taskService.deleteTask(authReq, id)
  }
}
