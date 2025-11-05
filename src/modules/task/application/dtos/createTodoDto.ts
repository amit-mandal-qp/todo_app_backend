import {TaskPriority, TaskStatus} from '@modules/task/domain/enums/taskEnums'
import {IsEnum, IsNotEmpty, IsString} from 'class-validator'

export class CreateTodoDTO {
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
