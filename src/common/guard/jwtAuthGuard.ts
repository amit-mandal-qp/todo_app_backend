// src/common/guards/jwt-auth.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import {Observable} from 'rxjs'
import {JwtService} from '@nestjs/jwt'
// Assuming SecurityUtil and AuthMiddlewareType are accessible globally or via a path alias
import {SecurityUtil} from '@modules/auth/application/utils/securityUtil'
import {AuthMiddlewareType} from './types/authMiddlewareTypes'

const {verifyJwtToken} = SecurityUtil

// Extend the Request interface to include the 'user' property (Same as before)
declare global {
  namespace Express {
    interface Request {
      user?: AuthMiddlewareType
    }
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  // We can inject JwtService directly, just like in your middleware
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Invalid Request: Missing or malformed Bearer token.',
      )
    }

    const token = authHeader.split(' ')[1]

    try {
      // Use your existing verification utility
      const decoded = verifyJwtToken(
        token,
        this.jwtService,
      ) as AuthMiddlewareType

      if (!decoded) {
        throw new UnauthorizedException('Invalid Token: Verification failed.')
      }

      // Attach the user payload to the request object (matching your middleware logic)
      request.user = decoded

      return true // Execution proceeds to the controller
    } catch (error) {
      // Catch errors thrown by verifyJwtToken (e.g., token expired)
      throw new UnauthorizedException('Invalid Token: Verification failed.')
    }
  }
}
