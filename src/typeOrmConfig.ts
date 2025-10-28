import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 54322,
      username: process.env.DB_USERNAME || 'amit',
      password: process.env.DB_PASSWORD || 'amitsecret',
      database: process.env.DB_DATABASE || 'todo_db',
      synchronize: true, // IMPORTANT: Use `synchronize: true` for E2E to auto-create schema/tables
      autoLoadEntities: true, // Automatically loads your entity files
    }),
  ],
})
export class DatabaseModule {}
