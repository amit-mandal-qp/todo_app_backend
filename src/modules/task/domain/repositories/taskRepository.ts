import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Task} from '../entities/taskEntity'
import {Repository} from 'typeorm'
import {
  CreateTaskType,
  ITaskType,
} from '@modules/task/application/types/taskTypes'
import {UpdateTaskDTO} from '@modules/task/application/dtos/taskDTOs'

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(taskData: CreateTaskType): Promise<Task> {
    const task = this.taskRepository.create(taskData)
    return this.taskRepository.save(task)
  }

  async update(id: number, updateData: UpdateTaskDTO): Promise<void> {
    await this.taskRepository.update({id: id}, updateData)
    return
  }

  async deleteById(id: number): Promise<void> {
    await this.taskRepository.delete({id: id})
    return
  }
}
