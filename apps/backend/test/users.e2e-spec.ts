import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { JwtAuthGuard } from '../src/modules/auth/guards/auth.guard';
import { UsersService } from '../src/modules/users/users.service';
import { ErrorMessages } from '../src/utils/error-messages';
import { UserDTO } from '../src/modules/users/dto/user.dto';
import { UpdateUserDto } from '../src/modules/users/dto/update-user.dto';
import { RoleEnum } from '../src/utils/enums';
import { TestAppModule } from './config/test-app.module';

const mockUser = {
  userId: 1,
  username: 'john',
  email: 'john@example.com',
  address: '123 Main St',
  phoneNumber: '123456789',
  licensePlate: 'XYZ123',
  role: RoleEnum.RegularUser,
};

const customAuthGuard = {
  canActivate: (context) => {
    const request = context.switchToHttp().getRequest();
    request.user = mockUser;
    return true;
  },
};

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;

  const mockUsers: UserDTO[] = [mockUser];

  const updateUserDto: UpdateUserDto = {
    username: 'john_updated',
    address: '456 New Ave',
    phoneNumber: '987654321',
    licensePlate: 'ABC456',
    password: 'newpassword',
    role: RoleEnum.RegularUser,
  };

  const mockSession = {
    user: mockUser,
    userMembership: null,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(customAuthGuard)
      .overrideProvider(UsersService)
      .useValue({
        findAll: jest.fn(),
        getCurrentSession: jest.fn(),
        updateUser: jest.fn(),
        remove: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    usersService = app.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    it('should return an array of users when users exist', async () => {
      jest.spyOn(usersService, 'findAll').mockResolvedValueOnce(mockUsers);
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);
      expect(response.body).toEqual(mockUsers);
    });

    it('should return 404 when no users are found', async () => {
      jest
        .spyOn(usersService, 'findAll')
        .mockRejectedValueOnce(
          new NotFoundException(ErrorMessages.USER_NOT_FOUND),
        );
      await request(app.getHttpServer()).get('/users').expect(404);
    });
  });

  describe('GET /users/current-session', () => {
    it('should return user session info', async () => {
      jest
        .spyOn(usersService, 'getCurrentSession')
        .mockResolvedValueOnce(mockSession);
      const response = await request(app.getHttpServer())
        .get('/users/current-session')
        .set('Authorization', 'Bearer dummy')
        .expect(200);
      expect(response.body).toEqual(mockSession);
    });

    it('should return 404 if user not found', async () => {
      jest
        .spyOn(usersService, 'getCurrentSession')
        .mockRejectedValueOnce(
          new NotFoundException(ErrorMessages.USER_NOT_FOUND),
        );
      await request(app.getHttpServer())
        .get('/users/current-session')
        .set('Authorization', 'Bearer dummy')
        .expect(404);
    });
  });

  describe('PATCH /users', () => {
    it('should update user successfully', async () => {
      const updatedUser: UserDTO = {
        ...mockUser,
        username: updateUserDto.username ?? mockUser.username,
        address: updateUserDto.address ?? mockUser.address,
        phoneNumber: updateUserDto.phoneNumber ?? mockUser.phoneNumber,
        licensePlate: updateUserDto.licensePlate ?? mockUser.licensePlate,
        role: updateUserDto.role ?? mockUser.role,
      };

      jest.spyOn(usersService, 'updateUser').mockResolvedValueOnce(updatedUser);
      const response = await request(app.getHttpServer())
        .patch('/users')
        .set('Authorization', 'Bearer dummy')
        .send(updateUserDto)
        .expect(200);
      expect(response.body).toEqual(updatedUser);
    });

    it('should return 404 if user to update is not found', async () => {
      jest
        .spyOn(usersService, 'updateUser')
        .mockRejectedValueOnce(
          new NotFoundException(ErrorMessages.USER_NOT_FOUND),
        );
      await request(app.getHttpServer())
        .patch('/users')
        .set('Authorization', 'Bearer dummy')
        .send(updateUserDto)
        .expect(404);
    });
  });

  describe('DELETE /users', () => {
    it('should delete user successfully', async () => {
      jest.spyOn(usersService, 'remove').mockResolvedValueOnce();
      await request(app.getHttpServer())
        .delete('/users')
        .set('Authorization', 'Bearer dummy')
        .expect(200);
    });

    it('should return 404 if user to delete is not found', async () => {
      jest
        .spyOn(usersService, 'remove')
        .mockRejectedValueOnce(
          new NotFoundException(ErrorMessages.USER_NOT_FOUND),
        );
      await request(app.getHttpServer())
        .delete('/users')
        .set('Authorization', 'Bearer dummy')
        .expect(404);
    });
  });
});
