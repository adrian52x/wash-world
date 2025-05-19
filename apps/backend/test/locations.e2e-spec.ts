import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { JwtAuthGuard } from '../src/modules/auth/guards/auth.guard';
import { LocationsService } from '../src/modules/locations/locations.service';
import { ErrorMessages } from '../src/utils/error-messages';
import { LocationDTO } from 'src/modules/locations/dto/location.dto';
import { TestAppModule } from './test-app.module';

describe('LocationsController (e2e)', () => {
  let app: INestApplication;
  let locationsService: LocationsService;

  const mockLocations: LocationDTO[] = [
    {
      locationId: 1,
      name: 'Location 1',
      address: '123 Sample Street',
      openingHours: '09:00-17:00',
      autoWashHalls: 2,
      selfWashHalls: 1,
      coordinates: {
        x: '10.672123100000022',
        y: '56.1908092',
      } as unknown as JSON,
    },
    {
      locationId: 2,
      name: 'Location 2',
      address: '456 Example Ave',
      openingHours: '10:00-18:00',
      autoWashHalls: 1,
      selfWashHalls: 2,
      coordinates: {
        x: '10.672123100000022',
        y: '56.1908092',
      } as unknown as JSON,
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    locationsService = app.get<LocationsService>(LocationsService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /locations', () => {
    it('should return an array of locations when locations exist', async () => {
      jest
        .spyOn(locationsService, 'getAll')
        .mockResolvedValueOnce(mockLocations);
      const response = await request(app.getHttpServer())
        .get('/locations')
        .expect(200);
      expect(response.body).toEqual(mockLocations);
    });

    it('should return 404 when no locations are found', async () => {
      jest
        .spyOn(locationsService, 'getAll')
        .mockRejectedValueOnce(
          new NotFoundException(ErrorMessages.LOCATIONS_NOT_FOUND),
        );
      await request(app.getHttpServer()).get('/locations').expect(404);
    });
  });
});
