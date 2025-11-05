import {Injectable, NotFoundException} from '@nestjs/common'
import {
  AuthenticatedRequest,
  ITaskCreatedResponseType,
  ITaskList,
} from '../types/taskTypes'
import {TaskRepository} from '@modules/task/domain/repositories/taskRepository'
import {UserTaskMapRepository} from '@modules/task/domain/repositories/userTaskMapRepository'
import {IResponse} from '@modules/infra/response/responseInterface'
import {ResponseService} from '@modules/infra/response/responseServic'
import {ICreateTodoInterface} from '../interfaces/createTodoInterface'
import {IUpdateTodoInterface} from '../interfaces/updateTodoInterface'

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userTaskMapRepository: UserTaskMapRepository,
    private readonly responseService: ResponseService,
  ) {}
  getTaskDetails(): IResponse<{message: string}> {
    return this.responseService.success({
      message: 'Hi Amit !! Welcome to QuestionPro',
    })
  }

  async createTask(
    authReq: AuthenticatedRequest,
    task: ICreateTodoInterface,
  ): Promise<IResponse<ITaskCreatedResponseType>> {
    const createdTask = await this.taskRepository.create(task)

    const userTaskMapData = {
      user_id: parseInt(authReq.user.id),
      task_id: createdTask.id,
    }

    await this.userTaskMapRepository.create(userTaskMapData)
    const response = {
      taskId: createdTask.id,
    }

    return this.responseService.success(response, 'Task Created Successfully')
  }

  async getAllTasksByUser(
    authReq: AuthenticatedRequest,
  ): Promise<IResponse<ITaskList>> {
    const todoList = await this.userTaskMapRepository.getAllTasksByUser(
      parseInt(authReq.user.id),
    )
    const response = {
      todo_list: todoList,
    }
    return this.responseService.success(
      response,
      'Tasks retrieved successfully',
    )
  }

  async updateTask(
    authReq: AuthenticatedRequest,
    updateData: IUpdateTodoInterface,
    id: string,
  ): Promise<IResponse<{message: string}>> {
    const isUserTaskExists =
      await this.userTaskMapRepository.getUserTaskMapData(
        parseInt(authReq.user.id),
        parseInt(id),
      )

    if (!isUserTaskExists) {
      throw new NotFoundException('Todo not found!')
    }
    await this.taskRepository.update(parseInt(id), updateData)

    // return genericResponse('Updated Task successfully')
    return this.responseService.success({message: 'Updated Task successfully'})
  }

  async deleteTask(
    authReq: AuthenticatedRequest,
    id: string,
  ): Promise<IResponse<{message: string}>> {
    const isUserTaskExists =
      await this.userTaskMapRepository.getUserTaskMapData(
        parseInt(authReq.user.id),
        parseInt(id),
      )

    if (!isUserTaskExists) {
      throw new NotFoundException('Todo not found!')
    }

    await Promise.all([
      this.userTaskMapRepository.deleteByTaskId(parseInt(id)),
      this.taskRepository.deleteById(parseInt(id)),
    ])
    return this.responseService.success({message: 'Task Deleted Successfully'})
  }
}
