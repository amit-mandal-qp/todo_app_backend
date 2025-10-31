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

export interface ITaskCreatedType {
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

export interface ITaskList {
  todo_list: ITaskType[]
}

export interface TaskUpdateResponse {
  message: string
}
