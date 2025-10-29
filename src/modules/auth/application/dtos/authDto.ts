import {IsNotEmpty, IsString, Length} from 'class-validator'

export class SignUpDTO {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @Length(6, 20)
  @IsNotEmpty()
  password: string
}

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  password: string
}
