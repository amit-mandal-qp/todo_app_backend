import {TaskPriority, TaskStatus} from '@modules/task/domain/enums/taskEnums'
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

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

// 1️⃣ Custom validator to ensure body is not empty
@ValidatorConstraint({name: 'nonEmptyObject', async: false})
export class NonEmptyObject implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    return value && Object.keys(value).length > 0
  }

  defaultMessage(): string {
    return 'At least one field must be provided.'
  }
}

export class UpdateTaskDTO {
  @Validate(NonEmptyObject)
  // 👆 applies the non-empty check on the whole DTO object
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string

  @IsOptional()
  @IsEnum(TaskPriority, {message: 'Invalid priority level provided.'})
  priority?: TaskPriority

  @IsOptional()
  @IsEnum(TaskStatus, {message: 'Invalid status provided.'})
  status?: TaskStatus
}
