import { Controller, NotFoundException, ForbiddenException, Get, Post, Body, UseGuards, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './entities/role.enum';
import { Roles } from './decorator/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { User } from './entities/user.entity';
import { CurrentUser } from './decorator/current-user.decorator';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  static create(createUserDto: CreateUserDto, arg1: any) {
    throw new Error('Method not implemented.');
  }
  static findAll() {
    throw new Error('Method not implemented.');
  }
  static findOne(userId: string) {
    throw new Error('Method not implemented.');
  }
  static update(userId: string, updateUserDto: UpdateUserDto, currentUser: User) {
    throw new Error('Method not implemented.');
  }
  static remove(userId: string, currentUser: User) {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.Admin, Role.User)
  async create(@Body() createUserDto: CreateUserDto, @CurrentUser() currentUser: User) {
    const newUser = await this.usersService.create(createUserDto);
    return { user: newUser, message: 'User created successfully' };
  }

  @Get()
  @Roles(Role.Admin, Role.User)
  async findAll() {
    const users = await this.usersService.findAll();
    return { users };
  }

  @Get(':id')
  @Roles(Role.Admin, Role.User)
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(+id);
      return { user };
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.User)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @CurrentUser() currentUser: User) {
    const userId = +id;

    try {
      const updatedUser = await this.usersService.update(userId, updateUserDto, currentUser);
      return { user: updatedUser, message: 'User updated successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`User with ID ${id} not found`);
      } else if (error instanceof ForbiddenException) {
        throw new ForbiddenException('You do not have permission to update this account.');
      } else {
        throw error;
      }
    }
    
  }

  @Delete(':id')
  @Roles(Role.User, Role.Admin)
  async remove(@Param('id') id: string, @CurrentUser() currentUser: User) {
    const userId = +id;

    try {
      await this.usersService.remove(userId, currentUser);
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`User with ID ${id} not found`);
      } else if (error instanceof ForbiddenException) {
        throw new ForbiddenException('You do not have permission to delete this account.');
      } else {
        throw error;
      }
    }
  }
}
