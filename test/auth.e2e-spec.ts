import {Test, TestingModule} from '@nestjs/testing'
import {INestApplication} from '@nestjs/common'
import * as request from 'supertest'
import {AppModule} from './../src/app.module'

describe('AuthController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    require('dotenv').config({path: '../src/config/.env.test'})
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/POST user signup - Should create a new user in the system', async () => {
    const signUpData = {
      username: 'testuser',
      password: 'testpassword',
    }

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(signUpData)
      .expect(201)

    expect(response.body).toEqual({
      message: 'User signed up successfully',
      data: null,
    })
  })

  it('/POST user signup with existing username - Should return an error', async () => {
    const signUpData = {
      username: 'testuser',
      password: 'testpassword',
    }

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(signUpData)
      .expect(400)

    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toEqual('Username already taken')
  })

  it('/POST user login - Should return successfull message with data', async () => {
    const loginData = {
      username: 'testuser',
      password: 'testpassword',
    }

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginData)
      .expect(200)

    expect(response.body).toHaveProperty('message')
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toHaveProperty('username')
    expect(response.body.data).toHaveProperty('token')
  })

  afterAll(async () => {
    await app.close()
  })
})
