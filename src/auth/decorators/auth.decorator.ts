import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserRoleGuard } from "../guards/user-role/user-role.guard";
import { AUTH_ROLES } from "../interfaces";
import { RoleProtected } from "./role-protected.decorator";


export function Auth(...roles: AUTH_ROLES[]){
    return applyDecorators(
            RoleProtected(...roles),
            UseGuards( AuthGuard(), UserRoleGuard )
        );
}