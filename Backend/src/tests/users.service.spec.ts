import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { UserRepository } from '../users/users.repository';
import { CreateUserDto  } from "../users/dto/create-user.dto";
import {UpdateUserDto} from "../users/dto/update-user.dto";
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: {
            findOneByEmail: jest.fn(),
            createUser: jest.fn(),
            updateUser: jest.fn(),
            removeUser: jest.fn(),
            findOneById: jest.fn(),
            find: jest.fn(),
            // Mock additional repository methods as needed
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('findOneByEmail', () => {
    it('should return a user for a valid email', async () => {
      const mockUser = new User();
      jest.spyOn(userRepository, 'findOneByEmail').mockResolvedValueOnce(mockUser);

      const result = await service.findOneByEmail('example@example.com');
      expect(result).toEqual(mockUser);
    });

    // ... More tests can be added here for different scenarios
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const mockUser = new User();
      const createUserDto = new CreateUserDto();
      jest.spyOn(userRepository, 'createUser').mockResolvedValueOnce(mockUser);

      const result = await service.create(createUserDto);
      expect(result).toEqual(mockUser);
    });

    // ... More tests can be added here for different scenarios
  });

  describe('update', () => {
    it('should update a user', async () => {
      const mockUser = new User();
      const updateUserDto = new UpdateUserDto();
      jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(mockUser);
      jest.spyOn(userRepository, 'updateUser').mockResolvedValueOnce(mockUser);

      const result = await service.update(1, updateUserDto, mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      const updateUserDto = new UpdateUserDto();
      jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(undefined);

      await expect(service.update(999, updateUserDto, new User())).rejects.toThrow(NotFoundException);
    });

    // ... More tests can be added here for different scenarios
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const adminUser = new User();
      adminUser.role = 'admin';
      const mockUser = new User();

      jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(mockUser);
      await expect(service.remove(1, adminUser)).resolves.not.toThrow();
    });

    it('should throw ForbiddenException if current user is not an admin', async () => {
      const nonAdminUser = new User();
      nonAdminUser.role = 'user';

      await expect(service.remove(1, nonAdminUser)).rejects.toThrow(ForbiddenException);
    });

    // ... More tests can be added here for different scenarios
  });

  describe('findOneById', () => {
    it('should return a user for a valid ID', async () => {
      const mockUser = new User();
      jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(mockUser);

      const result = await service.findOneById(1);
      expect(result).toEqual(mockUser);
    });

    // ... More tests can be added here for different scenarios
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [new User(), new User()];
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce(mockUsers);

      const result = await service.findAll();
      expect(result).toEqual(mockUsers);
    });

    // ... More tests can be added here for different scenarios
  });

  // Add tests for the testing-specific methods if needed
});
