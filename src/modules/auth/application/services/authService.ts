import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import {SecurityUtil} from '../utils/securityUtil'
import {UserRepository} from '@modules/auth/domain/repositories/userRepository'
import {JwtService} from '@nestjs/jwt'
import {AuthData} from '../types/authTypes'
import {BloomFilterService} from './bloomFilterService'
import {ResponseService} from '@modules/infra/response/responseServic'
import {IResponse} from '@modules/infra/response/responseInterface'
const {passwordHashing, passwordComparison, generateJwtToken} = SecurityUtil

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
    private readonly bloomFilterService: BloomFilterService,
    private readonly responseService: ResponseService,
  ) {}
  getProfileDetails(): IResponse<{message: string}> {
    return this.responseService.success({
      message: 'Hi Amit !! Welcome to QuestionPro',
    })
  }

  async signUpUser(
    username: string,
    password: string,
  ): Promise<IResponse<{message: string}>> {
    const mightExist = await this.bloomFilterService.mightContain(username)

    if (mightExist) {
      const isUserExist = await this.userRepository.findByUsername(username)
      if (isUserExist) {
        throw new BadRequestException('Username already taken')
      }
    }

    const hashedPassword = passwordHashing(password)
    await this.userRepository.createUser(username, hashedPassword)

    await this.bloomFilterService.add(username)
    const response = {
      message: 'User signed up successfully',
    }

    return this.responseService.success(response)
  }

  async logInUser(
    username: string,
    password: string,
  ): Promise<IResponse<AuthData>> {
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

    const response = {
      username: name,
      token: jwtToken,
    }

    return this.responseService.success(response, 'Login successful')
  }
}
