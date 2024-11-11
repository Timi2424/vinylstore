import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { UserService } from './user.service';


describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userService = { findByAuth0Id: jest.fn(), create: jest.fn(), updateByAuth0Id: jest.fn(), removeByAuth0Id: jest.fn() };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /user/profile', () => {
    const userProfile = { auth0Id: 'auth0|123', email: 'test@example.com', firstName: 'Test', lastName: 'User' };
    userService.findByAuth0Id.mockResolvedValue(userProfile);

    return request(app.getHttpServer())
      .get('/user/profile')
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.data).toEqual(userProfile);
      });
  });

  it('PATCH /user/profile', () => {
    const updatedProfile = { firstName: 'Updated', lastName: 'User' };
    userService.updateByAuth0Id.mockResolvedValue(updatedProfile);

    return request(app.getHttpServer())
      .patch('/user/profile')
      .send(updatedProfile)
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.data).toEqual(updatedProfile);
      });
  });

  it('DELETE /user/profile', () => {
    userService.removeByAuth0Id.mockResolvedValue(undefined);

    return request(app.getHttpServer())
      .delete('/user/profile')
      .expect(HttpStatus.NO_CONTENT);
  });
});
