import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common'
import {TaskController} from './application/controllers/taskController'
import {TaskService} from './application/services/taskService'
import {AuthMiddleware} from '@src/middleware/authMiddleware'
import {TaskRepository} from './domain/repositories/taskRepository'
import {TypeOrmModule} from '@nestjs/typeorm'
import {Task} from './domain/entities/taskEntity'
import {UserTaskMap} from './domain/entities/userTaskMapEntity'
import {UserTaskMapRepository} from './domain/repositories/userTaskMapRepository'
import {JwtModule} from '@nestjs/jwt'
import {jwtConstants} from '@modules/auth/application/constants/authConstants'

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, UserTaskMap]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '1h'},
    }),
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository, UserTaskMapRepository],
  exports: [TaskService, TaskRepository, UserTaskMapRepository],
})
export class TaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('task')
  }
}
