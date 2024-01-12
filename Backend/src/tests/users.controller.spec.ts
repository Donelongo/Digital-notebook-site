import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.enum';
import { UserRepository } from '../users/users.repository';

jest.mock('../users/users.service');

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    role: Role.User,
    notes: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, UserRepository],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: '',
        email: '',
        password: '',
        role: Role.User,
      };
      jest.spyOn(service, 'create').mockResolvedValueOnce(mockUser);

      expect(await controller.create(createUserDto, mockUser)).toEqual({
        user: mockUser,
        message: 'User created successfully',
      });
    });

    // Add tests for error cases if necessary...
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce([mockUser]);

      expect(await controller.findAll()).toEqual({ users: [mockUser] });
    });

    it('should return an array of users', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce([mockUser]);
      const result = await controller.findAll();
      expect(result).toEqual({ users: [mockUser] });
    });
  });

  describe('findOne', () => {
    it('should return a specific user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockUser);

      expect(await controller.findOne('1')).toEqual({ user: mockUser });
    });

    it('should throw NotFoundException for a non-existent user', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(() => {
        throw new NotFoundException(`User with ID 999 not found`);
      });

      await expect(controller.findOne('999')).rejects.toThrow(
        new NotFoundException(`User with ID 999 not found`),
      );
    });
    it('should return a specific user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockUser);
      const result = await controller.findOne('1');
      expect(result).toEqual({ user: mockUser });
    });

    it('should throw NotFoundException for a non-existent user', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(() => {
        throw new NotFoundException(`User with ID 999 not found`);
      });

      await expect(controller.findOne('999')).rejects.toThrow(
        new NotFoundException(`User with ID 999 not found`),
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        role: Role.User,
      };
      jest
        .spyOn(service, 'update')
        .mockResolvedValueOnce({ ...mockUser, ...updateUserDto });

      expect(await controller.update('1', updateUserDto, mockUser)).toEqual({
        user: { ...mockUser, ...updateUserDto },
        message: 'User updated successfully',
      });
    });

    it('should throw NotFoundException for a non-existent user', async () => {
      jest.spyOn(service, 'update').mockImplementation(() => {
        throw new NotFoundException(`User with ID 999 not found`);
      });

      await expect(
        controller.update('999', {} as UpdateUserDto, mockUser),
      ).rejects.toThrow(new NotFoundException(`User with ID 999 not found`));
    });

    // Additional tests for ForbiddenException if necessary...
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined);

      expect(await controller.remove('1', mockUser)).toEqual({
        message: 'User deleted successfully',
      });
    });

    it('should throw NotFoundException for a non-existent user', async () => {
      jest.spyOn(service, 'remove').mockImplementation(() => {
        throw new NotFoundException(`User with ID 999 not found`);
      });

      await expect(controller.remove('999', mockUser)).rejects.toThrow(
        new NotFoundException(`User with ID 999 not found`),
      );
    });

    // Additional tests for ForbiddenException if necessary...
  });
});
