import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import {Task} from './taskEntity'

@Entity('user_task_map')
export class UserTaskMap {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  user_id: number

  @Column()
  task_id: number

  @ManyToOne(() => Task)
  @JoinColumn({name: 'task_id'})
  task: Task

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date
}
