import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UserService>;

  beforeEach(async () => {
    const users: User[] = [];
    // create a fake copy of the user service
    fakeUserService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: fakeUserService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@gmail.com', '123456a@');
    expect(user.password).not.toBe('123456a@');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throw an error if user signs up with the already email address', async () => {
    await service.signup('test@gmail.com', 'adasdasdaf');
    try {
      await service.signup('test@gmail.com', '123456a@');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('throws an error if user signs in with an used email', async () => {
    await service.signup('test.adminv2@gmail.com', '123456a@');
    try {
      await service.signin('test.admin@gmail.com', '123456a@');
    } catch (error) {
      expect(
        error instanceof BadRequestException ||
          error instanceof NotFoundException,
      ).toBe(true);
    }
  });

  it('throws an error if user signs in with a wrong password', async () => {
    await service.signup('test@gmail.com', '1234567a@');
    try {
      await service.signin('test@gmail.com', '123456a@');
    } catch (error) {
      expect(error instanceof BadRequestException).toBe(true);
    }
  });

  it('returns a user if signs in with correct password', async () => {
    await service.signup('test@gmail.com', '123456a@');
    const user = await service.signin('test@gmail.com', '123456a@');
    expect(user).toBeDefined();
  });
});
