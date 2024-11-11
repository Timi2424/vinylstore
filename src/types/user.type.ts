export interface UserType {
  auth0Id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  birthdate?: string | Date;
  avatar?: string;
  role?: 'user' | 'admin';
}
