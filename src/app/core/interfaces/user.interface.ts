export interface User {
  id?: string;
  firstName?: string;
  lastNameFather?: string;
  lastNameMother?: string;
  password?: string;
  registrationNumber?: string;
  phone?: string;
  email?: string;
  birthDate?: Date;
  state?: string;
  termsAccepted?: boolean;
  userType?: string;
  image?: string;
  currentGroupId?: string;
}

export interface CreateUserResponse {
  user: User;
  setupToken?: string;
}

export enum UserType {
  ADMIN = 'admin',
  STUDENT = 'student',
  TEACHER = 'teacher',
}
