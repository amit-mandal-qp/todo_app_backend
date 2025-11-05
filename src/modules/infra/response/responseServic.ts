import {Injectable} from '@nestjs/common'
import {IResponse} from './responseInterface'

@Injectable()
export class ResponseService {
  success<T>(data: T, message?: string): IResponse<T> {
    return {data, message}
  }
}
