import {Injectable, NestMiddleware} from '@nestjs/common'
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

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      try {
        const decoded = verifyJwtToken(
          token,
          this.jwtService,
        ) as AuthMiddlewareType // Replace with your actual secret key
        req.user = decoded // Set the decoded data to req.user
      } catch (error) {
        // Handle token verification errors (e.g., invalid token, expired token)
        console.error('JWT verification error:', error)
      }
    }
    next()
  }
}
