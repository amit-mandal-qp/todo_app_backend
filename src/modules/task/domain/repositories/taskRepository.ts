import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Task} from '../entities/taskEntity'
import {Repository} from 'typeorm'
import {IUpdateTodoInterface} from '@modules/task/application/interfaces/updateTodoInterface'
import {ICreateTodoInterface} from '@modules/task/application/interfaces/createTodoInterface'

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(taskData: ICreateTodoInterface): Promise<Task> {
    const task = this.taskRepository.create(taskData)
    return this.taskRepository.save(task)
  }

  async update(id: number, updateData: IUpdateTodoInterface): Promise<void> {
    await this.taskRepository.update({id: id}, updateData)
    return
  }

  async deleteById(id: number): Promise<void> {
    await this.taskRepository.delete({id: id})
    return
  }
}
