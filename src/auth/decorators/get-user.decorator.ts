import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const GetUser = createParamDecorator((data:string | string[], ctx: ExecutionContext)=>{
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if(!user) throw new InternalServerErrorException('User not found request');
    if(typeof data === "string"){
        return user[data];
    }
    if(typeof data === "object"){
        const u = {}
        data.forEach( e => u[e] = user[e])
        return u
    }

    
    return user;
})