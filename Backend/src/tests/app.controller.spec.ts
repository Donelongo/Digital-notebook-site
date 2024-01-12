import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response, Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UserRepository } from '../users/users.repository';

jest.mock('bcrypt');

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, JwtService, UserRepository],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should throw BadRequestException if required fields are missing', async () => {
      await expect(appController.register('', '', '', '')).rejects.toThrow(BadRequestException);
    });

    it('should successfully register a user', async () => {
      const user: User = new User();
      user.id = 1;
      user.name = 'John Doe';
      user.email = 'john@example.com';
      user.password = 'hashedPassword';
      user.role = 'user';

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      jest.spyOn(appService, 'create').mockResolvedValue(user);

      const result = await appController.register('John Doe', 'john@example.com', 'password123', 'user');
      expect(result).toEqual(user);
    });
  });

  // Implementation of the register method in AppController

  describe('login', () => {
    it('should throw BadRequestException for invalid email', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';
      const response: Partial<Response> = { cookie: jest.fn() };

      jest.spyOn(appService, 'findOne').mockResolvedValue(null);

      await expect(
        appController.login(email, password, response as Response),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequestException for invalid password', async () => {
      const email = 'valid@example.com';
      const password = 'invalidPassword';
      const response: Partial<Response> = { cookie: jest.fn() };

      jest.spyOn(appService, 'findOne').mockResolvedValue({ email, password: 'hashedPassword' } as User);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        appController.login(email, password, response as Response),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should login successfully and set JWT cookie', async () => {
      const email = 'valid@example.com';
      const password = 'validPassword';
      const response: Partial<Response> = { cookie: jest.fn() };

      jest.spyOn(appService, 'findOne').mockResolvedValue({ email, password: 'hashedPassword' } as User);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('jwtToken');

      const result = await appController.login(email, password, response as Response);

      expect(result).toEqual({ message: 'Logged in successfully' }); // Updated to match the controller's response
      expect(response.cookie).toHaveBeenCalledWith('jwt', 'jwtToken', expect.any(Object));
    });
    it('should throw BadRequestException for invalid email', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';
      const response: Partial<Response> = { cookie: jest.fn() };

      jest.spyOn(appService, 'findOne').mockResolvedValue(null);

      await expect(
        appController.login(email, password, response as Response),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequestException for invalid password', async () => {
      const email = 'valid@example.com';
      const password = 'invalidPassword';
      const response: Partial<Response> = { cookie: jest.fn() };

      jest.spyOn(appService, 'findOne').mockResolvedValue({ email, password: 'hashedPassword' } as User);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        appController.login(email, password, response as Response),
      ).rejects.toThrowError(BadRequestException);
    });
  });

   
  describe('user', () => {
    it('should get user information successfully', async () => {
      const request: Partial<Request> = { cookies: { jwt: 'validToken' } };
      const userData: User = new User();
      userData.id = 1;
      userData.name = 'John Doe';
      userData.email = 'john@example.com';
      userData.password = 'hashedPassword';
      userData.role = 'user';

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ id: userData.id });
      jest.spyOn(appService, 'findOne').mockResolvedValue(userData);

      const result = await appController.user(request as Request);
      expect(result).toEqual(userData);
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      const request: Partial<Request> = { cookies: { jwt: 'invalidToken' } };
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(null);

      await expect(appController.user(request as Request)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should logout successfully and clear JWT cookie', async () => {
      const response: Partial<Response> = { clearCookie: jest.fn() };

      const result = await appController.logout(response as Response);
      expect(result).toEqual({ message: 'success' });
      expect(response.clearCookie).toHaveBeenCalledWith('jwt');
    });
  });

  // Add more tests for other methods if needed
});