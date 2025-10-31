import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {
  CreateTaskType,
  ITaskListType,
} from '@modules/task/application/types/taskTypes'
import {UserTaskMap} from '../entities/userTaskMapEntity'

@Injectable()
export class UserTaskMapRepository {
  constructor(
    @InjectRepository(UserTaskMap)
    private readonly userTaskMapRepository: Repository<UserTaskMap>,
  ) {}

  async create(userTaskData: {
    user_id: number
    task_id: number
  }): Promise<void> {
    const userTaskMap = this.userTaskMapRepository.create(userTaskData)
    await this.userTaskMapRepository.save(userTaskMap)
    return
  }

  async getAllTasksByUser(userId: number): Promise<ITaskListType[]> {
    const userTasks = await this.userTaskMapRepository.find({
      where: {user_id: userId},
      relations: ['task'],
      order: {task: {id: 'ASC'}},
    })

    const formattedTasks: ITaskListType[] = userTasks.map(ut => ({
      id: ut.task.id,
      title: ut.task.title,
      description: ut.task.description,
      priority: ut.task.priority,
      status: ut.task.status,
    }))

    return formattedTasks
  }

  async getUserTaskMapData(
    userId: number,
    taskId: number,
  ): Promise<UserTaskMap | null> {
    return await this.userTaskMapRepository.findOne({
      where: {user_id: userId, task_id: taskId},
    })
  }

  async deleteByTaskId(taskId: number): Promise<void> {
    await this.userTaskMapRepository.delete({task_id: taskId})
    return
  }
}
