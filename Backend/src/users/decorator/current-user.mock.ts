import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../entities/user.entity';

export const CurrentUserMock = (user: User) => {
  return createParamDecorator((data: unknown, context: ExecutionContext): User => {
    return user;
  })();
};
