import {Injectable, NotFoundException} from '@nestjs/common'
import {CreateTaskDTO, UpdateTaskDTO} from '../dtos/taskDto'
import {
  AuthenticatedRequest,
  ITaskCreatedType,
  ITaskList,
} from '../types/taskTypes'
import {TaskRepository} from '@modules/task/domain/repositories/taskRepository'
import {UserTaskMapRepository} from '@modules/task/domain/repositories/userTaskMapRepository'
import {
  BaseResponse,
  GenericResponse,
  genericResponse,
  genericResponseWithData,
} from '@src/common/responseGeneric'

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userTaskMapRepository: UserTaskMapRepository,
  ) {}
  getTaskDetails(): BaseResponse {
    return genericResponse('Hi Amit !! Welcome to QuestionPro')
  }

  async createTask(
    authReq: AuthenticatedRequest,
    task: CreateTaskDTO,
  ): Promise<GenericResponse<ITaskCreatedType>> {
    const createdTask = await this.taskRepository.create(task)

    const userTaskMapData = {
      user_id: parseInt(authReq.user.id),
      task_id: createdTask.id,
    }

    await this.userTaskMapRepository.create(userTaskMapData)

    return genericResponseWithData<ITaskCreatedType>(
      'Task Created Successfully',
      {
        taskId: createdTask.id,
      },
    )
  }

  async getAllTasksByUser(
    authReq: AuthenticatedRequest,
  ): Promise<GenericResponse<ITaskList>> {
    const todoList = await this.userTaskMapRepository.getAllTasksByUser(
      parseInt(authReq.user.id),
    )

    return genericResponseWithData<ITaskList>('Tasks retrieved successfully', {
      todo_list: todoList,
    })
  }

  async updateTask(
    authReq: AuthenticatedRequest,
    updateData: UpdateTaskDTO,
    id: string,
  ): Promise<BaseResponse> {
    const isUserTaskExists =
      await this.userTaskMapRepository.getUserTaskMapData(
        parseInt(authReq.user.id),
        parseInt(id),
      )

    if (!isUserTaskExists) {
      throw new NotFoundException('Todo not found!')
    }
    await this.taskRepository.update(parseInt(id), updateData)

    return genericResponse('Updated Task successfully')
  }

  async deleteTask(
    authReq: AuthenticatedRequest,
    id: string,
  ): Promise<BaseResponse> {
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
    return genericResponse('Task Deleted Successfully')
  }
}
