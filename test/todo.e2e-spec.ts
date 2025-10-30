import {Test, TestingModule} from '@nestjs/testing'
import {INestApplication} from '@nestjs/common'
import * as request from 'supertest'
import {AppModule} from './../src/app.module'
import {createAndLoginTestUser, fieldMissingErrors} from './utils/test-utils'
import {ValidationPipe} from '@nestjs/common'

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

    // expect(response.body).toEqual({
    //   message: 'Todos retrieved successfully',
    //   data: [],
    // })
  })

  it('/POST create todo with empty data - Should return 400', async () => {
    await request(app.getHttpServer())
      .post('/task/create')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(400)
  })

  it('/POST create todo with invalid property - Should return 400', async () => {
    await request(app.getHttpServer())
      .post('/task/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Todo',
        priority: 'HIGH',
        invalidProp: 'invalid',
      })
      .expect(400)
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

    // fieldMissingErrors.forEach(msg => {
    //   expect(response.body.message).toContain(msg)
    // })
  })

  it('/POST create todo with invalid status - Should return 400', async () => {
    await request(app.getHttpServer())
      .post('/task/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Todo',
        description: 'This is a test todo',
        priority: 'LOW',
        status: 'INVALID_STATUS',
      })
      .expect(400)
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

  //   it('/POST create todo with valid data - Should create todo successfully', async () => {
  //     const response = await request(app.getHttpServer())
  //       .post('/task/create')
  //       .set('Authorization', `Bearer ${token}`)
  //       .send({
  //         title: 'Test Todo',
  //         description: 'This is a test todo',
  //         priority: 'MEDIUM',
  //         status: 'PENDING',
  //       })
  //       .expect(201)

  //     expect(response.body).toHaveProperty('message')
  //     expect(response.body).toHaveProperty('taskId')
  //     expect(response.body.message).toEqual('Task created successfully')
  //   })

  //   it('/POST create todo with valid data (2) - Should create todo successfully', async () => {
  //     const response = await request(app.getHttpServer())
  //       .post('/task/create')
  //       .set('Authorization', `Bearer ${token}`)
  //       .send({
  //         title: 'Test Todo 2',
  //         description: 'This is a test todo 2',
  //         priority: 'HIGH',
  //         status: 'COMPLETED',
  //       })
  //       .expect(201)

  //     expect(response.body).toHaveProperty('message')
  //     expect(response.body).toHaveProperty('taskId')
  //     expect(response.body.message).toEqual('Task created successfully')
  //   })

  it('/PUT update todo with invalid id - Should return 404', async () => {
    await request(app.getHttpServer())
      .put('/task/update/999')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Test Todo',
        priority: 'LOW',
        status: 'COMPLETED',
      })
      .expect(404)
  })

  afterAll(async () => {
    await app.close()
  })
})
