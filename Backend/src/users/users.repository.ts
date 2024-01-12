// users.repository.ts
import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ where: { email } });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, role } = createUserDto;
    const newUser = this.create({ name, email, password, role });
    return await this.save(newUser);
  }

  async updateUser(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    const { name, email, password, role } = updateUserDto;
    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;
    user.role = role || user.role;
    return await this.save(user);
  }

  async removeUser(user: User): Promise<void> {
    await this.remove(user);
  }

  async findOneById(id: number): Promise<User | undefined> {
    try {
      const user = await this.findOneById(id);

      if (!user) {
        throw new NotFoundException(`User with ID '${id}' not found`);
      }

      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw new NotFoundException('User not found');
    }
  }

  // Methods for testing

  async findOneByEmailForTesting(email: string): Promise<User | undefined> {
    return this.findOne({ where: { email } });
  }

  async createUserForTesting(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, role } = createUserDto;
    const newUser = this.create({ name, email, password, role });
    return await this.save(newUser);
  }

  async updateUserForTesting(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    const { name, email, password, role } = updateUserDto;
    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;
    user.role = role || user.role;
    return await this.save(user);
  }

  async removeUserForTesting(user: User): Promise<void> {
    await this.remove(user);
  }

  async findOneByIdForTesting(id: number): Promise<User | undefined> {
    return this.findOneById(id);
  }

  // Add more custom repository methods for testing if needed
}
