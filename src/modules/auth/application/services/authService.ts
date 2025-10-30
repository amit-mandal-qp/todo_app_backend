import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import {SecurityUtil} from '../utils/securityUtil'
import {UserRepository} from '@modules/auth/domain/repositories/userRepository'
import {JwtService} from '@nestjs/jwt'
import {LoginResponse, SignUpResponse} from '../types/authTypes'
const {passwordHashing, passwordComparison, generateJwtToken} = SecurityUtil

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  getProfileDetails(): string {
    return 'Hi Amit !! Welcome to QuestionPro'
  }

  async signUpUser(
    username: string,
    password: string,
  ): Promise<SignUpResponse> {
    const isUserExist = await this.userRepository.findByUsername(username)
    if (isUserExist) {
      throw new BadRequestException('Username already taken')
    }
    const hashedPassword = passwordHashing(password)
    await this.userRepository.createUser(username, hashedPassword)

    return {
      message: 'User signed up successfully',
      data: null,
    }
  }

  async logInUser(username: string, password: string): Promise<LoginResponse> {
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

    return {
      message: 'Login successful',
      data: {
        username: name,
        token: jwtToken,
      },
    }
  }
}
