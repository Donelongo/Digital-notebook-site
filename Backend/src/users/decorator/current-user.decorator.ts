import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {User} from '../entities/user.entity'

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): User => {
  const request = context.switchToHttp().getRequest();
  return request.user;// Assuming the user information is stored in the 'user' property of the request
  },
);