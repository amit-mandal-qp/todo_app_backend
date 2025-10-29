import * as bcrypt from 'bcrypt'
import {JwtService} from '@nestjs/jwt'
import {AuthMiddlewareType} from '@src/middleware/types/authMiddlewareTypes'
function passwordHashing(password: string): string {
  const saltOrRounds = 10
  const hashedPassword = bcrypt.hashSync(password, saltOrRounds)
  return hashedPassword
}

function passwordComparison(
  plainPassword: string,
  hashedPassword: string,
): boolean {
  return bcrypt.compareSync(plainPassword, hashedPassword)
}

function generateJwtToken(payload: object, jwtService: JwtService): string {
  return jwtService.sign(payload)
}

function verifyJwtToken(
  token: string,
  jwtService: JwtService,
): AuthMiddlewareType | null {
  try {
    const {id, username} = jwtService.verify<AuthMiddlewareType>(token)
    return {id, username}
  } catch (error) {
    return null
  }
}

export const SecurityUtil = {
  passwordHashing,
  passwordComparison,
  generateJwtToken,
  verifyJwtToken,
}
