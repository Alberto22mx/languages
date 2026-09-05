import { Exams } from "./exams.interface";
import { Games } from "./games.interface";
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
  templateId?: string;
  templateVersion?: number;
  teacherId?: string;
  enrollmentStatus?: 'in_progress' | 'completed' | 'withdrawn';
  enrollmentUpdatedAt?: string;
  studentIds?: string[];
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
  templateId?: string;
  templateVersion?: number;
  teacherId?: string;
  enrollmentStatus?: 'in_progress' | 'completed' | 'withdrawn';
  enrollmentUpdatedAt?: string;
  exams?: Exams[];
  lessons?: Lessons[];
  games?: Games[];
  users?: string[];
}
