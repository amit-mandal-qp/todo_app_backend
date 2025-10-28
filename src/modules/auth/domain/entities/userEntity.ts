// src/order/order.entity.ts
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from 'typeorm'

@Entity('user') // Table name in PostgreSQL
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({type: 'text'})
  username: string

  @Column({type: 'text'})
  password: string

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date
}
