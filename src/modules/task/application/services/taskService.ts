import {Injectable, NotFoundException} from '@nestjs/common'
import {CreateTaskDTO, UpdateTaskDTO} from '../dtos/taskDto'
import {
  AuthenticatedRequest,
  ITaskListType,
  TaskCreatedResponse,
  TaskUpdateResponse,
} from '../types/taskTypes'
import {TaskRepository} from '@modules/task/domain/repositories/taskRepository'
import {UserTaskMapRepository} from '@modules/task/domain/repositories/userTaskMapRepository'

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userTaskMapRepository: UserTaskMapRepository,
  ) {}
  getTaskDetails(): string {
    return 'Hi Amit !! Welcome to QuestionPro'
  }

  async createTask(
    authReq: AuthenticatedRequest,
    task: CreateTaskDTO,
  ): Promise<TaskCreatedResponse> {
    const createdTask = await this.taskRepository.create(task)

    const userTaskMapData = {
      user_id: parseInt(authReq.user.id),
      task_id: createdTask.id,
    }

    await this.userTaskMapRepository.create(userTaskMapData)

    return {
      message: 'Task created successfully',
      taskId: createdTask.id,
    }
  }

  async getAllTasksByUser(
    authReq: AuthenticatedRequest,
  ): Promise<ITaskListType[]> {
    return await this.userTaskMapRepository.getAllTasksByUser(
      parseInt(authReq.user.id),
    )
  }

  async updateTask(
    authReq: AuthenticatedRequest,
    updateData: UpdateTaskDTO,
    id: string,
  ): Promise<TaskUpdateResponse> {
    const isUserTaskExists =
      await this.userTaskMapRepository.getUserTaskMapData(
        parseInt(authReq.user.id),
        parseInt(id),
      )

    if (!isUserTaskExists) {
      throw new NotFoundException('Task not found for the user')
    }
    await this.taskRepository.update(parseInt(id), updateData)

    return {
      message: 'Updated Task successfully',
    }
  }

  async deleteTask(authReq: AuthenticatedRequest, id: string): Promise<string> {
    const isUserTaskExists =
      await this.userTaskMapRepository.getUserTaskMapData(
        parseInt(authReq.user.id),
        parseInt(id),
      )

    if (!isUserTaskExists) {
      throw new NotFoundException('Task not found for the user')
    }

    await Promise.all([
      this.userTaskMapRepository.deleteByTaskId(parseInt(id)),
      this.taskRepository.deleteById(parseInt(id)),
    ])
    return 'Task Deleted Successfully'
  }
}
