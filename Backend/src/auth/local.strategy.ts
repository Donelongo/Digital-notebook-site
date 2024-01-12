import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService){
        super();
    }

    validate(user_name: string, password: string){
        const user = this.authService.validateUser(user_name, password);
        if(!user){
            return new UnauthorizedException();
        }
        return user
    }
}