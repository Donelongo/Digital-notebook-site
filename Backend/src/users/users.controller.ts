import { Controller, Delete, Get, Param, Post, Put, Query, Body, NotFoundException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
// import { AuthGuard } from '../auth/auth.guard';

// @UseGuards(AuthGuard)
@Controller('users')
export class UsersController {

    constructor(private readonly UsersService: UsersService){}


    @Get()
    getUsers(){
        try {
            return this.UsersService.getUsers()
        } catch (err) {
            throw new NotFoundException()
        }
    }

    @Get(':user_name')
    getUser(@Param('user_name') user_name: string){
        try {
            return this.UsersService.getUser(user_name)
        } catch (err) {
            throw new NotFoundException("user not found 0X12")
        }
    }

    @Put(':user_name')
    updateUser(@Param('user_name') user_name: string, @Body() newUser: UpdateUserDto){
        return this.UsersService.update_user(user_name, newUser)
    }

    @Post()
    createUser(@Body() newUser: CreateUserDto){

    }
    @Post('login')
    checkuser(@Body() userData: CreateUserDto){
        let loginStat = this.UsersService.confirm_user(userData.user_name, userData.password)
        return {loginStat}
    }


    @Delete(':user_name')
    removeuser(@Param('user_Name') user_Name:string){
        return null
    }
}
