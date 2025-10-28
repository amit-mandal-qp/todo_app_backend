import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {In, Repository} from 'typeorm'
import {User} from '../entities/taskEntity'

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(username: string, password: string): Promise<User> {
    const user = this.userRepository.create({username, password})
    return this.userRepository.save(user)
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({where: {username}})
  }
}
