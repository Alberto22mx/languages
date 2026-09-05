export type CourseTemplateStatus = 'active' | 'archived';

export interface CourseTemplate {
  id: string;
  name: string;
  course: string;
  level: string;
  version: number;
  status: CourseTemplateStatus;
  previousTemplateId?: string;
  lessons: string[];
  exams: string[];
}
