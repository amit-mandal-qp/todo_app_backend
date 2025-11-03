import {Test, TestingModule} from '@nestjs/testing'
import {INestApplication} from '@nestjs/common'
import * as request from 'supertest'
import {AppModule} from '../src/app.module'
import {createAndLoginTestUser, fieldMissingErrors} from './utils/test-utils'
import {ValidationPipe} from '@nestjs/common'
import e from 'express'

describe('TodoController (e2e)', () => {
  let app: INestApplication
  let token: string

  beforeAll(async () => {
    require('dotenv').config({path: '../src/config/.env.test'})
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    await app.init()

    token = await createAndLoginTestUser(app)
  })

  it('/GET todos - Should return an empty array initially', async () => {
    const response = await request(app.getHttpServer())
      .get('/task/list')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body).toHaveProperty('message')
    expect(response.body).toHaveProperty('data')
    expect(Array.isArray(response.body.data)).toBe(true)
    expect(response.body.data).toEqual([])
  })

  it('/POST create todo with empty data - Should return 400', async () => {
    const response = await request(app.getHttpServer())
      .post('/task/create')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(400)

    expect(response.body).toHaveProperty('message')
    expect(Array.isArray(response.body.message)).toBe(true)

    fieldMissingErrors.forEach(msg => {
      expect(response.body.message).toContain(msg)
    })
  })

  it('/POST create todo with invalid property (description renamed as descriptio) - Should return 400', async () => {
    const response = await request(app.getHttpServer())
      .post('/task/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Todo',
        descriptio: 'This is a test todo',
        priority: 'LOW',
        status: 'PENDING',
      })
      .expect(400)

    expect(response.body).toHaveProperty('message')
    expect(Array.isArray(response.body.message)).toBe(true)

    const expectedMessages = [
      'description should not be empty',
      'description must be a string',
    ]

    expectedMessages.forEach(msg => {
      expect(response.body.message).toContain(msg)
    })
  })

  it('/POST create todo with invalid priority - Should return 400', async () => {
    const response = await request(app.getHttpServer())
      .post('/task/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Todo',
        description: 'This is a test todo',
        priority: 'INVALID_PRIORITY',
        status: 'PENDING',
      })
      .expect(400)

    expect(response.body).toHaveProperty('message')
    expect(Array.isArray(response.body.message)).toBe(true)

    expect(response.body.message).toContain('Invalid priority level provided.')
  })

  it('/POST create todo with invalid status - Should return 400', async () => {
    const response = await request(app.getHttpServer())
      .post('/task/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Todo',
        description: 'This is a test todo',
        priority: 'LOW',
        status: 'INVALID_STATUS',
      })
      .expect(400)

    expect(response.body).toHaveProperty('message')
    expect(Array.isArray(response.body.message)).toBe(true)

    expect(response.body.message).toContain('Invalid status provided.')
  })

  it('/ POST create todo without token - Should return 401', async () => {
    const response = await request(app.getHttpServer())
      .post('/task/create')
      .send({
        title: 'Test Todo',
        description: 'This is a test todo',
        priority: 'LOW',
        status: 'PENDING',
      })
      .expect(401)

    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toEqual('Invalid Request')
  })

  it('/POST create todo with valid data - Should create todo successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/task/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Todo',
        description: 'This is a test todo',
        priority: 'MEDIUM',
        status: 'PENDING',
      })
      .expect(201)

    expect(response.body).toHaveProperty('message')
    expect(response.body).toHaveProperty('taskId')
    expect(response.body.message).toEqual('Task created successfully')
  })

  it('/PUT update todo with invalid id - Should return 404', async () => {
    const response = await request(app.getHttpServer())
      .put('/task/update/999')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Test Todo',
        priority: 'LOW',
        status: 'COMPLETED',
      })
      .expect(404)

    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toEqual('Todo not found!')
  })

  it('/PUT update todo with empty value (title as empty string) - Should return 400', async () => {
    const response = await request(app.getHttpServer())
      .put('/task/update/3')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '',
        priority: 'LOW',
        status: 'COMPLETED',
      })
      .expect(400)

    const expectedMessages = [
      'title should not be empty',
      'At least one field must be provided.',
    ]

    expect(response.body).toHaveProperty('message')
    expect(Array.isArray(response.body.message)).toBe(true)
    expectedMessages.forEach(msg => {
      expect(response.body.message).toContain(msg)
    })
  })

  it('/PUT update todo with valid data (Update title and status) - Should update todo successfully', async () => {
    const response = await request(app.getHttpServer())
      .put('/task/update/3')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Test Todo',
        status: 'COMPLETED',
      })
      .expect(200)

    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toEqual('Task updated successfully')
  })

  it('/DELETE todo with invalid id - Should return 404', async () => {
    const response = await request(app.getHttpServer())
      .delete('/task/delete/999')
      .set('Authorization', `Bearer ${token}`)
      .expect(404)

    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toEqual('Todo not found!')
  })

  it('/DELETE todo with valid id - Should delete todo successfully', async () => {
    const response = await request(app.getHttpServer())
      .delete('/task/delete/3')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toEqual('Task deleted successfully')
  })

  afterAll(async () => {
    await app.close()
  })
})
