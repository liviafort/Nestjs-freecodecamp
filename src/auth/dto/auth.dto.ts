import { IsEmail, IsNotEmpty, IsString, IsInt } from "class-validator";

export class AuthDto{
    @IsEmail() //validar se é email
    @IsNotEmpty() //validar se não está vazio
    email: string;

    @IsString() //verificar se é string
    @IsNotEmpty() //verificar se está ou não vazio
    password: string;
}
