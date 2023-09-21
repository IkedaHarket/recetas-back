import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";
import { IsValidDifficulty } from "../decorators";

export class CreateRecipeDto {
    
    @ApiProperty()
    @IsString()
    @MinLength(4, { message: 'El nombre debe tener un minimo de 4 caracteres' })
    @MaxLength(25,{ message: 'El nombre debe tener un maximo de 25 caracteres' })
    name:string;

    @ApiProperty()
    @IsValidDifficulty()
    difficult:string;

    @ApiProperty()
    @IsString()
    recipe_time:string;

    @ApiProperty()
    @IsString()
    @MinLength(50, { message: 'Los pasos deben tener un minimo de 50 caracteres' })
    steps:string;

    @ApiProperty()
    @IsString()
    @MinLength(50, { message: 'La descripcion debe tener un minimo de 50 caracteres' })
    description:string;
}
