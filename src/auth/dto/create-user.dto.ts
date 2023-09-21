import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, MinLength, MaxLength, Matches, IsOptional } from "class-validator";

export class CreateUserDto {
    
    @ApiProperty()
    @IsString()
    @IsEmail()
    email:string;

    @ApiProperty()
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener un minimo de 6 caracteres' })
    @MaxLength(50,{ message: 'La contraseña debe tener un maximo de 50 caracteres' })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener almenos una mayuscula, minuscula, numeros y 6 caracteres'
    })
    password:string;

    @ApiProperty()
    @IsString()
    @MinLength(6,{ message: 'El nombre debe tener un minimo de 6 caracteres' })
    name:string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    image?: string;

}
