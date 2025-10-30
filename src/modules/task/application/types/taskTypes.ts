import {TaskPriority, TaskStatus} from '@modules/task/domain/enums/taskEnums'

export interface AuthenticatedRequest extends Request {
  user: {id: string; username: string}
}

export interface CreateTaskType {
  title: string
  description?: string
  priority: TaskPriority
  status?: TaskStatus
}

export interface TaskCreatedResponse {
  message: string
  taskId: number
}

export interface ITaskListType {
  id: number
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
}

export interface ITaskType {
  id: number
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
}

export interface ITaskListResponse {
  message: string
  data: ITaskType[]
}

export interface TaskUpdateResponse {
  message: string
}
