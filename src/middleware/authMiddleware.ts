import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common'
import {Request, Response, NextFunction} from 'express'
import {JwtService} from '@nestjs/jwt'
import {SecurityUtil} from '@modules/auth/application/utils/securityUtil'
import {AuthMiddlewareType} from './types/authMiddlewareTypes'
const {verifyJwtToken} = SecurityUtil

// Extend the Request interface to include the 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: AuthMiddlewareType
    }
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      throw new UnauthorizedException('Invalid Request')
    }

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const decoded = verifyJwtToken(
        token,
        this.jwtService,
      ) as AuthMiddlewareType

      if (!decoded) {
        throw new UnauthorizedException('Invalid Token')
      }
      req.user = decoded
      next()
    }
  }
}
