export interface User {
  id?: string;
  firstName: string;
  lastNameFather: string;
  lastNameMother: string;
  password: string;
  registrationNumber: string;
  phone: string;
  email: string;
  birthDate: Date;
  state: string;
  termsAccepted: string;
  userType: string;
  image?: string;
  custom: string;
}

export enum UserType {
  ADMIN = 'admin',
  STUDENT = 'student',
  TEACHER = 'teacher',
}
