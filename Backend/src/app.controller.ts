import { Body, Controller, Post, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { User } from './users/entities/user.entity';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role: string,
  ): Promise<User> {
    if (!name || !email || !password) {
      throw new BadRequestException('Name, email, and password are required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.appService.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    delete user.password; // Remove password from the response
    return user;
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.appService.findOne(email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });
    response.cookie('jwt', jwt, { httpOnly: true });
    return { message: 'Logged in successfully' };
  }

  @Get('user')
  async user(@Req() request: Request) {
    const cookie = request.cookies['jwt'];
    if (!cookie) {
      throw new UnauthorizedException('Token not found');
    }

    const data = await this.jwtService.verifyAsync(cookie);
    if (!data) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.appService.findOne(data['id']);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    delete user.password; // Remove password from the response
    return user;
  }
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return { message: 'success' };
  }
}
