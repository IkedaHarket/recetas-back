import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {

  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      private readonly jwtService: JwtService
    ){}

  async createUser(createAuthDto: CreateUserDto) {
    const { password, ...userData } = createAuthDto;
    try {
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })
      await this.userRepository.save(user)
      delete user.password;
      return {
        ...user,
        token:this.getJwtToken({ id: user.id })
      }
    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  async login(loginUserDto: LoginUserDto){
      const { password, email } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: { email },
        select: { email:true, id:true, image:true, name:true, password:true, roles:true }
      })

      if( !user )
        throw new UnauthorizedException('El usuario o contraseña no son validos') 
      
      if( !bcrypt.compareSync( password, user.password ) )
          throw new UnauthorizedException('El usuario o contraseña no son validos')

      delete user.password

      return {
        ...user, 
        token: this.getJwtToken({ id:user.id })
      }
  }

  async renewToken(user:User){
    return {
      ...user,
      token: this.getJwtToken( {id: user.id} )
    };
  }

  private handleDBErrors(error:any): never {
    if(error.code === '23505') throw new BadRequestException(error.detail)
    console.log(error);
    throw new InternalServerErrorException('Please check server logs')
  }
  
  private getJwtToken( payload: JwtPayload ){
    return this.jwtService.sign( payload )
  }
}
