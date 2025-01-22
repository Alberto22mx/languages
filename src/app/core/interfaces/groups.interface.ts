import { Exams } from "./exams.interface";
import { Lessons } from "./lessons.interface";

export interface Group {
  id?: string;
  nameGroup?: string;
  description?: string;
  level?: string;
  schedule?: string;
  state?: 'active' | 'inactive';
  image?: string;
  course?: string;
  exams?: string[];
  lessons?: string[];
  games?: string[];
  users?: string[];
}

export interface GroupAllData {
  id?: string;
  nameGroup?: string;
  description?: string;
  level?: string;
  schedule?: string;
  state?: 'active' | 'inactive';
  image?: string;
  course?: string;
  exams?: Exams[];
  lessons?: Lessons[];
  games?: string[];
  users?: string[];
}