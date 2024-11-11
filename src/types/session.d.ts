import 'express-session';
import { UserType } from './types/user.type';

declare module 'express-session' {
  interface Session {
    user: UserType;
  }
}
