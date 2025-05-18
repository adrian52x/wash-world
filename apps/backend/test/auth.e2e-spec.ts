jest.mock('../src/logger/logger.middleware', () => ({
  LoggerMiddleware: class {
    use(req, res, next) {
      next();
    }
  },
}));

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestAppModule } from './test-app.module';
import { DataSource } from 'typeorm';
import { User } from '../src/entities/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const testUser = {
    email: `testuser_${Date.now()}@example.com`,
    username: 'testuser',
    password: 'password123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    const dataSource = app.get(DataSource);
    await dataSource.getRepository(User).delete({ email: testUser.email });
  });

  it('should sign up a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(testUser)
      .expect(201);
    expect(response.body).toHaveProperty('accessToken');
  });

  it('should not allow signup with an existing email', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(testUser)
      .expect(400);
  });

  it('should login an existing user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);
    expect(response.body).toHaveProperty('accessToken');
  });

  it('should not login with wrong password', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword',
      })
      .expect(400);
  });

  it('should validate an existing user email', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/validate-email')
      .send({ email: testUser.email })
      .expect(200);
    expect(response.body).toHaveProperty('isValid');
    expect(response.body.isValid).toBe(true);
  });

  it('should return false for a non-existing email validation', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/validate-email')
      .send({ email: 'nonexistent@example.com' })
      .expect(200);
    expect(response.body).toHaveProperty('isValid');
    expect(response.body.isValid).toBe(false);
  });
});
