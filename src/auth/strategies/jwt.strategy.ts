import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from "../entities";
import { Repository } from 'typeorm';
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../interfaces";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ){
    constructor(
            @InjectRepository(User)
            private readonly  userRepository: Repository<User>,
            configService: ConfigService
        ){
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload: JwtPayload): Promise<User>{
        const { id } = payload
        const user = await this.userRepository.findOneBy({ id })
        if(!user){
            throw new UnauthorizedException('El token no es valido')
        }
        if( !user.isActive ){
            throw new UnauthorizedException('Este usuario se encuentra inactivo')
        }
        return user
    }

}