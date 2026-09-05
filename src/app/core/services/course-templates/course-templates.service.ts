import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CourseTemplate } from '../../interfaces/course-template.interface';

@Injectable({ providedIn: 'root' })
export class CourseTemplatesService {
  private readonly baseUrl = environment.baseUrl + '/course-templates';

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<CourseTemplate[]> {
    return this.http.get<CourseTemplate[]>(this.baseUrl);
  }

  create(template: Omit<CourseTemplate, 'id'>): Observable<CourseTemplate> {
    return this.http.post<CourseTemplate>(this.baseUrl, template);
  }

  update(id: string, template: Partial<CourseTemplate>): Observable<CourseTemplate> {
    return this.http.patch<CourseTemplate>(`${this.baseUrl}/${id}`, template);
  }

  createNextVersion(id: string): Observable<CourseTemplate> {
    return this.http.post<CourseTemplate>(`${this.baseUrl}/${id}/versions`, {});
  }
}
