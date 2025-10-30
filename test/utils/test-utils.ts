import * as request from 'supertest'
import {INestApplication} from '@nestjs/common'

export async function createAndLoginTestUser(app: INestApplication) {
  const username = 'testuser'
  const password = 'testpassword'

  // Login
  const loginRes = await request(app.getHttpServer())
    .post('/auth/login')
    .send({username, password})
    .expect(200)

  return loginRes.body.data.token
}

export const fieldMissingErrors = [
  'title should not be empty',
  'title must be a string',
  'description should not be empty',
  'description must be a string',
  'priority should not be empty',
  'Invalid priority level provided.',
  'status should not be empty',
  'Invalid status provided.',
]
