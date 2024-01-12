import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../app.service';
import { UserRepository } from '../users/users.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

describe('AppService', () => {
  let service: AppService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService, UserRepository],
    })
    .overrideProvider(UserRepository)
    .useValue({
      save: jest.fn(),
      findOne: jest.fn(),
      findOneById: jest.fn(),
    })
    .compile();

    service = module.get<AppService>(AppService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const userData: User = { id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'user',
    notes:[]};
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(userData);
      jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(userData);

      const result = await service.create({ id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'user', isAdmin: false});
      expect(result).toEqual(userData);
    });

    it('should throw BadRequestException on error', async () => {
      jest.spyOn(userRepository, 'save').mockRejectedValue(new Error('Error'));
      await expect(service.create({ id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'user', isAdmin: false})).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a user for valid email', async () => {
      const userData: User = { id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'user',
    notes: []};
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(userData);

      const result = await service.findOne('valid@example.com');
      expect(result).toEqual(userData);
    });

    it('should throw BadRequestException for invalid email', async () => {
      await expect(service.findOne('')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException for non-existing email', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);
      await expect(service.findOne('nonexistent@example.com')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('should return a user for valid id', async () => {
      const userData: User = { id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'user',
    notes: []};
      jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(userData);

      const result = await service.findById(1);
      expect(result).toEqual(userData);
    });

    it('should throw NotFoundException for non-existing id', async () => {
      jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(undefined);
      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });
});
