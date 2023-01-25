import { Controller, Get, HttpStatus, Post } from "@nestjs/common";
import { Body, HttpCode } from "@nestjs/common/decorators";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}

    @Post('signup')
    signup(@Body() dto:AuthDto){ //forma de fazer requisição sem usar Req --- request (do express)
        return this.authService.signup(dto);
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto:AuthDto){
        return this.authService.signin(dto);
    }

}