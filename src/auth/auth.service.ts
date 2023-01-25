import { ForbiddenException, Injectable} from "@nestjs/common";
import { User, Bookmark} from '@prisma/client';
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService{
    constructor(private prisma: PrismaService, 
        private jwt: JwtService,
        private config: ConfigService){}
    //funções eu que uso no meu controller auth.controller
    async signup(dto: AuthDto){
        try{
            //gerar senha hash
            const hash = await argon.hash(dto.password);
            //salvar novo usuário no banco de dados
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                }
            });
            return this.signToken(user.id, user.email);
        }
        catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002'){
                    throw new ForbiddenException('Credentials taken')
                }
            }
            throw error;
        }
    };

    async signin(dto: AuthDto){
        //encontrar usuário pelo email
        const user = await this.prisma.user.findFirst({
            where: {
                email: dto.email,
            }
        })
        //se o usuario não existir lançar erro
        if (!user) throw new ForbiddenException('Credentials incorrect');
        //se a senha estiver incorreta lançar erro
        const pwMatches = await argon.verify(
            user.hash,
            dto.password,
            )
        if(!pwMatches) throw new ForbiddenException('Credential incorrect');
        return this.signToken(user.id, user.email);
    };

    async signToken(userId: number, email: string): Promise<{access_token: string}>{
      const payload ={
        sub: userId,
        email
      }
      
      const secret = this.config.get('JWT_SECRET');

      const token = await this.jwt.signAsync(payload, {
        expiresIn: '15m',
        secret: secret,
      })  

      return{
        access_token: token,
      }

    }
}