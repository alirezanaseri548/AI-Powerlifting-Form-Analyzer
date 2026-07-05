import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('API E2E Smoke', () => {
  let app: INestApplication;
  let accessToken: string;
  const email = `e2e_${Date.now()}@example.com`;
  const password = 'Test123456!';
  const name = 'E2E Test User';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/health', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/health')
      .expect(200);

    expect(res.body.status).toBe('ok');
  });

  it('GET /api/health/readiness', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/health/readiness')
      .expect(200);

    expect(res.body.status).toBe('ready');
  });

  it('POST /api/auth/register', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email,
        password,
        name,
      })
      .expect(201);

    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe(email);
    accessToken = res.body.accessToken;
  });

  it('GET /api/auth/me', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.email).toBe(email);
  });

  it('POST /api/analyses', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/analyses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        fileKey: 'videos/e2e-test.mp4',
        fileUrl: 'http://localhost:9000/powerlifting-videos/videos/e2e-test.mp4',
        fileName: 'e2e-test.mp4',
        mimeType: 'video/mp4',
        fileSize: 123,
      })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.status).toBeDefined();
  });

  it('GET /api/analyses', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/analyses')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });
});