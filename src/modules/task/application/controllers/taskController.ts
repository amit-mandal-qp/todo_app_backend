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
  ITaskCreatedType,
  ITaskList,
} from '../types/taskTypes'
import {CreateTaskDTO, UpdateTaskDTO} from '../dtos/taskDto'
import {IResponse} from '@modules/infra/response/responseInterface'

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Get()
  getTask(): IResponse<{message: string}> {
    return this.taskService.getTaskDetails()
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createTask(
    @Req() authReq: AuthenticatedRequest,
    @Body() createTaskDTO: CreateTaskDTO,
  ): Promise<IResponse<ITaskCreatedType>> {
    return this.taskService.createTask(authReq, createTaskDTO)
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  async getAllTasksByUser(
    @Req() authReq: AuthenticatedRequest,
  ): Promise<IResponse<ITaskList>> {
    return this.taskService.getAllTasksByUser(authReq)
  }

  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  async updateTask(
    @Req() authReq: AuthenticatedRequest,
    @Body() updateTaskDTO: UpdateTaskDTO,
    @Param('id') id: string,
  ): Promise<IResponse<{message: string}>> {
    return await this.taskService.updateTask(authReq, updateTaskDTO, id)
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteTask(
    @Req() authReq: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<IResponse<{message: string}>> {
    return this.taskService.deleteTask(authReq, id)
  }
}
