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
  exams?: Exams[];
  lessons?: Lessons[];
  games?: Games[];
  users?: string[];
}
