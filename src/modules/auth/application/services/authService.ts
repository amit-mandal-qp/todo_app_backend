import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import {SecurityUtil} from '../utils/securityUtil'
import {UserRepository} from '@modules/auth/domain/repositories/userRepository'
import {JwtService} from '@nestjs/jwt'
import {AuthData} from '../types/authTypes'
import {
  BaseResponse,
  GenericResponse,
  genericResponse,
  genericResponseWithData,
} from '@src/common/responseGeneric'
const {passwordHashing, passwordComparison, generateJwtToken} = SecurityUtil

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  getProfileDetails(): BaseResponse {
    return genericResponse('Hi Amit !! Welcome to QuestionPro')
  }

  async signUpUser(username: string, password: string): Promise<BaseResponse> {
    const isUserExist = await this.userRepository.findByUsername(username)
    if (isUserExist) {
      throw new BadRequestException('Username already taken')
    }
    const hashedPassword = passwordHashing(password)
    await this.userRepository.createUser(username, hashedPassword)

    return genericResponse('User signed up successfully')
  }

  async logInUser(
    username: string,
    password: string,
  ): Promise<GenericResponse<AuthData>> {
    const user = await this.userRepository.findByUsername(username)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    const {password: hashPassword, username: name, id} = user

    const isPasswordValid = passwordComparison(password, hashPassword)
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password')
    }

    const jwtToken = generateJwtToken({id, username: name}, this.jwtService)

    return genericResponseWithData('Login successful', {
      username: name,
      token: jwtToken,
    })
  }
}
