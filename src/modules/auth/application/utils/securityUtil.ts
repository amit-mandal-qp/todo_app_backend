import * as bcrypt from 'bcrypt'
import {JwtService} from '@nestjs/jwt'
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

export const SecurityUtil = {
  passwordHashing,
  passwordComparison,
  generateJwtToken,
}
