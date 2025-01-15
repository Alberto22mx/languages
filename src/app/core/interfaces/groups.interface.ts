import { Exams } from "./exams.interface";
import { Games } from "./games.interface";
import { Lessons } from "./lessons.interface";
import { User } from "./user.interface";

export interface Group {
  id: string;
  name: string;
  description: string;
  level: string;
  schedule: string;
  state: 'active' | 'inactive';
  image?: string;
  exams: Exams[];
  lessons: Lessons[];
  games: Games[];
  users: User[];
}