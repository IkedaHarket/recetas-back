import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AUTH_ROLES } from "../interfaces";
import { IMAGES_DEFAULT } from "src/common/interfaces";
import { Recipe } from "src/recipes/entities";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{ unique:true })
    email:string;

    @Column('text', { select:false })
    password:string;

    @Column('text')
    name:string;

    @Column('bool', { default:true })
    isActive:boolean;

    @Column('text', { array:true, default:[AUTH_ROLES.USER_ROLE] })
    roles:string;

    @Column('text', { default: IMAGES_DEFAULT.USER_PROFILE })
    image:string

    @OneToMany( 
        () => Recipe,
        recipe => recipe.user
    )
    recipe: Recipe

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.checkFieldsBeforeInsert()
    }
}
