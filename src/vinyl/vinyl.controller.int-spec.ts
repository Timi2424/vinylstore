import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { VinylService } from './vinyl.service';


describe('VinylController (integration)', () => {
  let app: INestApplication;
  let vinylService = { create: jest.fn(), findAll: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(VinylService)
      .useValue(vinylService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  }); 

  it('POST /vinyl/create', () => {
    const dto: CreateVinylDto = { name: 'Test Vinyl', artist: 'Test Artist', description: 'A test vinyl', price: 29.99 };
    vinylService.create.mockResolvedValue(dto);

    return request(app.getHttpServer())
      .post('/vinyl/create')
      .send(dto)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body.data).toEqual(expect.objectContaining(dto));
      });
  });

  it('GET /vinyl/all', () => {
    vinylService.findAll.mockResolvedValue([]);
    return request(app.getHttpServer())
      .get('/vinyl/all')
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.data).toEqual([]);
      });
  });

  it('GET /vinyl/:id', () => {
    const id = '1';
    const dto = { id, name: 'Test Vinyl', artist: 'Test Artist', description: 'A test vinyl', price: 29.99 };
    vinylService.findOne.mockResolvedValue(dto);

    return request(app.getHttpServer())
      .get(`/vinyl/${id}`)
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.data).toEqual(dto);
      });
  });
});
