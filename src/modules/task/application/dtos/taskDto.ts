import {TaskPriority, TaskStatus} from '@modules/task/domain/enums/taskEnums'
import {IsEnum, IsNotEmpty, IsString, Length} from 'class-validator'

export class CreateTaskDTO {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsEnum(TaskPriority, {message: 'Invalid priority level provided.'})
  @IsNotEmpty()
  priority: TaskPriority

  @IsEnum(TaskStatus, {message: 'Invalid status provided.'})
  @IsNotEmpty()
  status: TaskStatus
}

export class UpdateTaskDTO {
  @IsString()
  @IsNotEmpty()
  title?: string

  @IsString()
  @IsNotEmpty()
  description?: string

  @IsEnum(TaskPriority, {message: 'Invalid priority level provided.'})
  @IsNotEmpty()
  priority?: TaskPriority

  @IsEnum(TaskStatus, {message: 'Invalid status provided.'})
  @IsNotEmpty()
  status?: TaskStatus
}
