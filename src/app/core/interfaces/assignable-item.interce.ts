export interface AssignableItem {
  id: string;
  title?: string; // Usado por `Exams`, `Games`, y `Lessons`
  name?: string; // Usado por `User` y `Group`
  registrationNumber?: string; // Usado por `User`
  userType?: string;
}