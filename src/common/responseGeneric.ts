export class BaseResponse {
  message: string
  constructor(message: string) {
    this.message = message
  }
}

export class GenericResponse<T> extends BaseResponse {
  data: T
  constructor(message: string, data: T) {
    super(message)
    this.data = data
  }
}

// Factory helpers
export function genericResponse(message: string): BaseResponse {
  return new BaseResponse(message)
}

export function genericResponseWithData<T>(
  message: string,
  data: T,
): GenericResponse<T> {
  return new GenericResponse<T>(message, data)
}
