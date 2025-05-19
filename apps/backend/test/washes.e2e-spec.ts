import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { JwtAuthGuard } from '../src/modules/auth/guards/auth.guard';
import { WashesService } from '../src/modules/washes/washes.service';
import { ErrorMessages } from '../src/utils/error-messages';
import { WashTypeEnum } from '../src/utils/enums';
import { UserWashDTO } from 'src/modules/washes/dto/user-wash-dto';
import { TestAppModule } from './test-app.module';
import { WashTypeDTO } from 'src/modules/washes/dto/wash-type.dto';

const mockUser = {
  userId: 1,
  username: 'john',
  email: 'john@example.com',
};

const customAuthGuard = {
  canActivate: (context) => {
    const req = context.switchToHttp().getRequest();
    req.user = mockUser;
    return true;
  },
};

const mockWashTypes: WashTypeDTO[] = [
  {
    washTypeId: 1,
    type: WashTypeEnum.Premium,
    price: 10.0,
    description: 'Basic Wash Service',
    isAutoWash: true,
  },
];

const mockUserWashes: UserWashDTO[] = [
  {
    washId: 1,
    createdAt: new Date('2025-01-01T00:00:00Z'),
    location: {
      locationId: 1,
      name: 'Test Location',
      address: '123 Test St',
      openingHours: '09:00-17:00',
      autoWashHalls: 2,
      selfWashHalls: 1,
      coordinates: {
        x: '10.672123100000022',
        y: '56.1908092',
      } as unknown as JSON,
    },
    washType: {
      washTypeId: 1,
      type: WashTypeEnum.Premium,
      price: 10.0,
      description: 'Basic Wash Service',
      isAutoWash: true,
    },
  },
];

describe('WashesController (e2e)', () => {
  let app: INestApplication;
  let washesService: WashesService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(customAuthGuard)
      .overrideProvider(WashesService)
      .useValue({
        washTypesGetAll: jest.fn(),
        getUserWashes: jest.fn(),
        createWashSession: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    washesService = app.get<WashesService>(WashesService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /washes', () => {
    it('should return all wash types', async () => {
      jest.spyOn(washesService, 'washTypesGetAll').mockResolvedValueOnce(mockWashTypes);
      const response = await request(app.getHttpServer())
        .get('/washes')
        .expect(200);
      expect(response.body).toEqual(mockWashTypes);
    });

    it('should return 404 if no wash types found', async () => {
      jest
        .spyOn(washesService, 'washTypesGetAll')
        .mockRejectedValueOnce(new NotFoundException(ErrorMessages.WASH_TYPES_NOT_FOUND));
      await request(app.getHttpServer()).get('/washes').expect(404);
    });
  });

  describe('GET /washes/user', () => {
    it('should return user washes', async () => {
      jest.spyOn(washesService, 'getUserWashes').mockResolvedValueOnce(mockUserWashes);
      const response = await request(app.getHttpServer())
        .get('/washes/user')
        .set('Authorization', 'Bearer dummy')
        .expect(200);

      const userWashesWithDate = response.body.map((wash: UserWashDTO) => ({
        ...wash,
        createdAt: new Date(wash.createdAt),
      }));
      expect(userWashesWithDate).toEqual(mockUserWashes);
    });

    it('should return 404 if user washes not found', async () => {
      jest
        .spyOn(washesService, 'getUserWashes')
        .mockRejectedValueOnce(new NotFoundException(ErrorMessages.USER_WASH_SESSIONS_NOT_FOUND));
      await request(app.getHttpServer())
        .get('/washes/user')
        .set('Authorization', 'Bearer dummy')
        .expect(404);
    });
  });

  describe('POST /washes', () => {
    const createWashSessionDto = { washTypeId: 1, locationId: 1 };

    it('should create wash session successfully', async () => {
      jest.spyOn(washesService, 'createWashSession').mockResolvedValueOnce({ success: true });
      const response = await request(app.getHttpServer())
        .post('/washes')
        .set('Authorization', 'Bearer dummy')
        .send(createWashSessionDto)
        .expect(201);
      expect(response.body).toEqual({ success: true });
    });

    it('should return error if creation fails', async () => {
      jest.spyOn(washesService, 'createWashSession').mockRejectedValueOnce(new NotFoundException(ErrorMessages.USER_NOT_FOUND));
      await request(app.getHttpServer())
        .post('/washes')
        .set('Authorization', 'Bearer dummy')
        .send(createWashSessionDto)
        .expect(404);
    });
  });
});