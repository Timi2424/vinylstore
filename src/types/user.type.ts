export interface UserType {
  id?: string;
  auth0Id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  birthdate?: string | Date;
  avatar?: string;
  role?: string;
}
