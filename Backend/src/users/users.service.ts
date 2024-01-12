// users.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './users.repository'; // Import the UserRepository
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository, // Use UserRepository instead of Repository<User>
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOneByEmail(email);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.createUser(createUserDto);
  }

  async update(userId: number, updateUserDto: UpdateUserDto, currentUser: User): Promise<User> {
    const userToUpdate = await this.userRepository.findOneById(userId);
    if (!userToUpdate) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return this.userRepository.updateUser(userToUpdate, updateUserDto);
  }

  async remove(userId: number, currentUser: User): Promise<void> {
    if (currentUser.role !== 'admin') {
      throw new ForbiddenException('You do not have permission to delete this account.');
    }
    const userToRemove = await this.userRepository.findOneById(userId);
    if (!userToRemove) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }};

  async findOneById(id: number): Promise<User | undefined> {
    return this.userRepository.findOneById(id);
  }
  async findOne(id: number): Promise<User | undefined> {
    return this.userRepository.findOneById(id);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  // Methods for testing

  async findOneByEmailForTesting(email: string): Promise<User | undefined> {
    return this.userRepository.findOneByEmailForTesting(email);
  }

  async createUserForTesting(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.createUserForTesting(createUserDto);
  }

  async updateUserForTesting(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userRepository.updateUserForTesting(user, updateUserDto);
  }

  async removeUserForTesting(user: User): Promise<void> {
    return this.userRepository.removeUserForTesting(user);
  }

  async findOneByIdForTesting(id: number): Promise<User | undefined> {
    return this.userRepository.findOneByIdForTesting(id);
  }

  // Add more service methods for testing if needed
}
