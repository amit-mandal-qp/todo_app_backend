import {Module} from '@nestjs/common'
import {AuthController} from './application/controllers/authController'
import {AuthService} from './application/services/authService'
import {TypeOrmModule} from '@nestjs/typeorm'
import {User} from './domain/entities/userEntity'
import {UserRepository} from './domain/repositories/userRepository'
import {JwtModule} from '@nestjs/jwt'
import {jwtConstants} from './application/constants/authConstants'
import {BloomFilterService} from './application/services/bloomFilterService'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '1h'},
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, BloomFilterService],
  exports: [AuthService, UserRepository, BloomFilterService],
})
export class AuthModule {}
