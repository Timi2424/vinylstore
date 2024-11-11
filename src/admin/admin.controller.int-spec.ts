import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { AdminService } from './admin.service';


describe('AdminController (integration)', () => {
  let app: INestApplication;
  let adminService = { readSystemLogs: jest.fn(), deleteSystemLogs: jest.fn(), readControllerLogs: jest.fn(), deleteControllerLogs: jest.fn() };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AdminService)
      .useValue(adminService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /admin/logs/system', () => {
    adminService.readSystemLogs.mockResolvedValue('System log content');
    
    return request(app.getHttpServer())
      .get('/admin/logs/system')
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.logs).toBe('System log content');
      });
  });

  it('DELETE /admin/logs/system', () => {
    adminService.deleteSystemLogs.mockResolvedValue('System logs cleared');

    return request(app.getHttpServer())
      .delete('/admin/logs/system')
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.message).toBe('System logs cleared');
      });
  });

  it('GET /admin/logs/controller', () => {
    adminService.readControllerLogs.mockResolvedValue('Controller log content');

    return request(app.getHttpServer())
      .get('/admin/logs/controller')
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.logs).toBe('Controller log content');
      });
  });

  it('DELETE /admin/logs/controller', () => {
    adminService.deleteControllerLogs.mockResolvedValue('Controller logs cleared');

    return request(app.getHttpServer())
      .delete('/admin/logs/controller')
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.message).toBe('Controller logs cleared');
      });
  });
});
