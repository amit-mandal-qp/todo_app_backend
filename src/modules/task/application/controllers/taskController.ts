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
  UseGuards,
} from '@nestjs/common'
import {TaskService} from '../services/taskService'
import {
  AuthenticatedRequest,
  ITaskCreatedResponseType,
  ITaskList,
} from '../types/taskTypes'
import {IResponse} from '@modules/infra/response/responseInterface'
import {JwtAuthGuard} from '@src/common/guard/jwtAuthGuard'
import {CreateTodoDTO} from '../dtos/createTodoDto'
import {UpdateTodoDTO} from '../dtos/updateTodoDto'

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Get()
  getTask(): IResponse<{message: string}> {
    return this.taskService.getTaskDetails()
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createTask(
    @Req() authReq: AuthenticatedRequest,
    @Body() createTaskDTO: CreateTodoDTO,
  ): Promise<IResponse<ITaskCreatedResponseType>> {
    return this.taskService.createTask(authReq, createTaskDTO)
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAllTasksByUser(
    @Req() authReq: AuthenticatedRequest,
  ): Promise<IResponse<ITaskList>> {
    return this.taskService.getAllTasksByUser(authReq)
  }

  @Put('update/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateTask(
    @Req() authReq: AuthenticatedRequest,
    @Body() updateTaskDTO: UpdateTodoDTO,
    @Param('id') id: string,
  ): Promise<IResponse<{message: string}>> {
    return await this.taskService.updateTask(authReq, updateTaskDTO, id)
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteTask(
    @Req() authReq: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<IResponse<{message: string}>> {
    return this.taskService.deleteTask(authReq, id)
  }
}
