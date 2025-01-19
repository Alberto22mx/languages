export interface Group {
  id?: string;
  name?: string;
  description?: string;
  level?: string;
  schedule?: string;
  state?: 'active' | 'inactive';
  image?: string;
  exams?: string[];
  lessons?: string[];
  games?: string[];
  users?: string[];
}