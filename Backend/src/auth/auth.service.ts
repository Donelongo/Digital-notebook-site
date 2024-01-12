import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { promises } from 'dns';

@Injectable()
export class AuthService {
    constructor(private readonly UsersService: UsersService){}

    async validateUser(user_name: string, pass: string): Promise<any> {
        const user = await this.UsersService.getUser(user_name);

        if (user && user.password === pass) {
            let { password, ...rest } = user;
            return rest;
        }
    }
}
