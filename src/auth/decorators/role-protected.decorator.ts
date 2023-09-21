import { SetMetadata } from '@nestjs/common';
import { AUTH_ROLES } from '../interfaces';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: AUTH_ROLES[]) => {
    return SetMetadata( META_ROLES , args)
};
