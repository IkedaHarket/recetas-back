import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RECIPES_DIFFICULTY } from "../interfaces";
import { IMAGES_DEFAULT } from "src/common/interfaces";
import { User } from "src/auth/entities";

@Entity('recipes')
export class Recipe {
    
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text')
    name:string;

    @Column('text',{ default: RECIPES_DIFFICULTY.NORMAL })
    difficult:string;

    @Column('text')
    recipe_time:string;

    @Column('text')
    steps:string;

    @Column('text')
    description:string;

    @Column('text',{ default: IMAGES_DEFAULT.RECIPES })
    image:string;

    @Column('bool', { default: true })
    isActive: boolean;

    @ManyToOne(
        () => User,
        ( user ) => user.recipe,
        { eager: true }
    )
    user:User;
}
