import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RECIPES_DIFFICULTY } from "../interfaces";
import { IMAGES_DEFAULT } from "src/common/interfaces";

@Entity('recipes')
export class Recipe {
    
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text')
    name:string;

    @Column('text',{ array:true, default: RECIPES_DIFFICULTY.NORMAL })
    difficult:string;

    @Column('text')
    recipe_time:string;

    @Column('text')
    steps:string;

    @Column('text')
    description:string;

    @Column('text',{ default: IMAGES_DEFAULT.RECIPES })
    image:string;
}
