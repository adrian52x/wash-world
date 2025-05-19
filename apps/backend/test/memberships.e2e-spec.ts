import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { TestAppModule } from './test-app.module';
import { JwtAuthGuard } from '../src/modules/auth/guards/auth.guard';
import { MembershipsService } from '../src/modules/memberships/memberships.service';
import { ErrorMessages } from '../src/utils/error-messages';
import { MembershipTypeEnum } from '../src/utils/enums';
import { MembershipDTO } from 'src/modules/memberships/dto/membership.dto';
import { UserMembershipDTO } from 'src/modules/memberships/dto/user-membership.dto';

describe('MembershipsController (e2e)', () => {
  let app: INestApplication;
  let membershipsService: MembershipsService;

  const mockMemberships: MembershipDTO[] = [
    {
      membershipId: 1,
      type: MembershipTypeEnum.Premium,
      price: 100,
      washTypeId: 1,
    },
    {
      membershipId: 2,
      type: MembershipTypeEnum.Gold,
      price: 50,
      washTypeId: 2,
    },
  ];

  const mockUserMembership: UserMembershipDTO = {
    userMembershipId: 1,
    startDate: new Date('2025-01-01T00:00:00Z'),
    endDate: new Date('2025-02-01T00:00:00Z'),
    membership: {
      membershipId: 1,
      type: MembershipTypeEnum.Premium,
      price: 100,
      washTypeId: 1,
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const request = context.switchToHttp().getRequest();
          request.user = { email: 'test@example.com', password: 'password' };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    membershipsService = app.get<MembershipsService>(MembershipsService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /memberships', () => {
    it('should return an array of memberships when they exist', async () => {
      jest
        .spyOn(membershipsService, 'getAll')
        .mockResolvedValueOnce(mockMemberships);
      const response = await request(app.getHttpServer())
        .get('/memberships')
        .expect(200);
      expect(response.body).toEqual(mockMemberships);
    });

    it('should return 404 when no memberships are found', async () => {
      jest
        .spyOn(membershipsService, 'getAll')
        .mockRejectedValueOnce(
          new NotFoundException(ErrorMessages.MEMBERSHIPS_NOT_FOUND),
        );
      await request(app.getHttpServer()).get('/memberships').expect(404);
    });
  });

  describe('POST /memberships', () => {
    it('should create a new membership for a user', async () => {
      jest
        .spyOn(membershipsService, 'create')
        .mockResolvedValueOnce(mockUserMembership);
      const response = await request(app.getHttpServer())
        .post('/memberships')
        .send({ membershipId: 1 })
        .expect(201);

      expect(response.body).toMatchObject({
        userMembershipId: mockUserMembership.userMembershipId,
        startDate: mockUserMembership.startDate.toISOString(),
        endDate: mockUserMembership.endDate.toISOString(),
        membership: mockUserMembership.membership,
      });
    });

    it('should return 404 when creating a membership fails', async () => {
      jest
        .spyOn(membershipsService, 'create')
        .mockRejectedValueOnce(
          new NotFoundException(ErrorMessages.USER_MEMBERSHIP_NOT_FOUND),
        );
      await request(app.getHttpServer())
        .post('/memberships')
        .send({ membershipId: 999 })
        .expect(404);
    });
  });
});
