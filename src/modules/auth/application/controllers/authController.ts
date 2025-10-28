import {Body, Controller, Get, HttpCode, HttpStatus, Post} from '@nestjs/common'
import {AuthService} from '../services/authService'
import {LoginDTO, SignUpDTO} from '../dtos/authDTOs'
import {LoginResponse} from '../types/authTypes'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get()
  getProfile(): string {
    return this.authService.getProfileDetails()
  }

  // sing up
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDTO: SignUpDTO): Promise<string> {
    const {username, password} = signUpDTO
    return this.authService.signUpUser(username, password)
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDTO: LoginDTO): Promise<LoginResponse> {
    const {username, password} = loginDTO
    return await this.authService.logInUser(username, password)
  }
}
